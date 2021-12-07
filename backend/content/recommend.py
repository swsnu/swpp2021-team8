"""
Recommendation System based on 4 FEATURES EQUALLY

Top 10 similar movies to The Dark Knight Rises are:

The Dark Knight
Amidst the Devil's Wings
The Killer Inside Me
The Prestige
Batman Returns
Batman
Batman & Robin
Kick-Ass
RockNRolla
Kick-Ass 2
"""
# MODIFY THIS AS YOU PLEASE
movie_user_likes = "Titanic"

import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity

df = pd.read_csv("movie_dataset.csv")

features = ['keywords','cast','genres','director']

def combine_features(row):
    return row['keywords']+" "+row['cast']+" "+row['genres']+" "+row['director']

for feature in features:
    df[feature] = df[feature].fillna('') #filling all NaNs with blank string

#applying combined_features() method over each rows of dataframe and storing the combined string in "combined_features" column
df["combined_features"] = df.apply(combine_features,axis=1) 
df.iloc[0].combined_features

cv = CountVectorizer() #creating new CountVectorizer() object
count_matrix = cv.fit_transform(df["combined_features"]) #feeding combined strings(movie contents) to CountVectorizer() object

cosine_sim = cosine_similarity(count_matrix)

def get_index_from_title(title):
    return df[df.title == title]["index"].values[0]

def get_title_from_index(index):
    return df[df.index == index]["title"].values[0]
def get_genres_from_index(index):
    return df[df.index == index]["genres"].values
def get_director_from_index(index):
    return df[df.index == index]["director"].values
def get_cast_from_index(index):
    return df[df.index == index]["cast"].values
def get_keywords_from_index(index):
    return df[df.index == index]["keywords"].values

movie_index = get_index_from_title(movie_user_likes)
similar_movies = list(enumerate(cosine_sim[movie_index])) #accessing the row corresponding to given movie to find all the similarity scores for that movie and then enumerating over it

sorted_similar_movies = sorted(similar_movies,key=lambda x:x[1],reverse=True)[1:]
sorted_similar_movies = sorted_similar_movies[1:11]


print("Top 10 similar movies to "+movie_user_likes+" are:\n")
for element in sorted_similar_movies:
    print(get_title_from_index(element[0]))
    print(get_keywords_from_index(element[0]))
    print(get_cast_from_index(element[0]))
    print(get_genres_from_index(element[0]))
    print(get_director_from_index(element[0]))