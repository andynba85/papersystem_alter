from flask import Flask
from flask import render_template
from flask import request,redirect
from flask import url_for
from flask import jsonify
import json
from keras.applications.vgg16 import VGG16
from keras.preprocessing import image
from keras.applications.vgg16 import preprocess_input, decode_predictions
import os
import sys
import numpy as np

app = Flask(__name__)
#app.config['JSON_AS_ASCII'] = False
# 計算相似矩陣
def cosine_similarity(ratings):
    sim = ratings.dot(ratings.T)
    if not isinstance(sim, np.ndarray):
        sim = sim.toarray()
    norms = np.array([np.sqrt(np.diagonal(sim))])
    return (sim / norms / norms.T)

def pre_model(region,name):
    y_test=[]
    x_test=[]
    x_dict={}
    count = 0
    for img_path in os.listdir("img"+region+"/"): 
        print(count)
        if img_path.endswith(".jpg"):
            img = image.load_img("img/"+region+"/"+img_path, target_size=(224, 224))
            y_test.append(img_path[0:4])
            x = image.img_to_array(img)
            x = np.expand_dims(x, axis=0)
            if len(x_test) > 0:
                x_test = np.concatenate((x_test,x))
            else:
                x_test=x

            x_dict.update({img_path.split('.')[0]:count})
        count+=1
    print(x_dict)

    x_test = preprocess_input(x_test)
    model = VGG16(weights='imagenet', include_top=False)
    features = model.predict(x_test)
    features_compress = features.reshape(len(y_test),7*7*512)
    sim = cosine_similarity(features_compress)
    top = np.argsort(-sim[x_dict[name]], axis=0)[1:4]
    print(top)
    recommend = [y_test[i] for i in top]
    print(recommend)


@app.route('/')
def index():
    return render_template('swipe-pre.html')

@app.route('/<region>')
def region(region):
    return render_template('swipe-habit.html', selectregion = region)

@app.route('/predict',methods=['GET','POST'])
def predict():
    if request.method == 'POST':
        region = request.values['region']
        like = request.values['like']
        soso = request.values['soso']
        dislike = request.values['dislike']

        for i in like.split(','):
            print(i)
        result = {}
        y_test=[]
        x_test=[]
        x_dict={}
        count = 0
        for img_path in os.listdir("img/"+region+"/"): 
            print(count)
            if img_path.endswith(".jpg"):
                img = image.load_img("img/"+region+"/"+img_path, target_size=(224, 224))
                y_test.append(img_path.split('.')[0])
                x = image.img_to_array(img)
                x = np.expand_dims(x, axis=0)
                if len(x_test) > 0:
                    x_test = np.concatenate((x_test,x))
                else:
                    x_test=x

                x_dict.update({img_path.split('.')[0]:count})
            count+=1
        print(x_dict)

        x_test = preprocess_input(x_test)
        model = VGG16(weights='imagenet', include_top=False)
        features = model.predict(x_test)
        features_compress = features.reshape(len(y_test),7*7*512)
        sim = cosine_similarity(features_compress)
        if len(like) != 0:
            for i in like.split(','):
                print(i)
                templike = np.argsort(-sim[x_dict[i]], axis=0)[1:5]
            recommendlike = [y_test[i] for i in templike] 
            print(recommendlike)
            for i in range(4):
                result.update({y_test[templike[i]]:4-i}) 
        
        if len(soso) != 0:
            for j in soso.split(','):
                tempsoso = np.argsort(-sim[x_dict[j]], axis=0)[1:5]
            recommendsoso = [y_test[j] for j in tempsoso]
            print(recommendsoso)
            for i in range(4):
                if(y_test[tempsoso[i]] in result):
                    result.update({y_test[tempsoso[i]]:result[y_test[tempsoso[i]]]+1}) 
                else:
                    result.update({y_test[tempsoso[i]]:i}) 
        if len(dislike) != 0:
            for u in dislike.split(','):
                tempdislike = np.argsort(-sim[x_dict[u]], axis=0)[1:5]
            recommenddislike = [y_test[u] for u in tempdislike]
            print(recommenddislike)
            for i in range(4):
                if(y_test[tempdislike[i]] in result):
                    result.update({y_test[tempdislike[i]]:result[y_test[tempdislike[i]]]+i-4}) 
                else:
                    result.update({y_test[tempdislike[i]]:i-4}) 

        print(result)
        
        def order_dict(dicts, n):
            result = []
            result1 = []
            p = sorted([(k, v) for k, v in dicts.items()], reverse=True)
            s = set()
            for i in p:
                s.add(i[1])
            for i in sorted(s, reverse=True)[:n]:
                for j in p:
                    if j[1] == i:
                        result.append(j)
            for r in result:
                result1.append(r[0])
        
            return result1

        result = order_dict(result,5)
        print(result)
        
        #return redirect(url_for('adjust',rec=json.dumps({"list":result},ensure_ascii=False),region=region))
        return redirect(url_for('adjust',rec=result,region=region))

@app.route('/adjust/<region>/<rec>')
def adjust(rec,region):
    return render_template('adjustver2_flask.html',rec = rec,region=region)

if __name__ == '__main__':
    app.debug = True
    app.run(port = 5600)


#新增的時候先存id到資料庫，