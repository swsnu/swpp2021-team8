import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel, cosine_similarity
from ast import literal_eval
from sklearn.feature_extraction.text import CountVectorizer

df1 = pd.read_csv('credits.csv')
df2 = pd.read_csv('movies.csv')

# merge 2 datasets on 'id'
df1.columns = ['id', 'title', 'cast', 'crew']
df2 = df2.merge(df1, on='id')

"""
Movie Rate
"""
# C : average of all the movie's 'vote_average'
C = df2['vote_average'].mean()
# m : lowest 10% 'vote_count' of total movies
m = df2['vote_count'].quantile(0.9)

# delete lowest 10% vote_count movies
do_not_recommend = df2['title_x'].copy().loc[df2['vote_count'] >= m]

# weighted average func
def weighted_rating(x, m=m, C=C):
    v = x['vote_count']
    R = x['vote_average']
    # Calculation based on IMDB formula
    return (v/(v+m)*R + (m/(m+v)*C))

# add a column 'rate' based on our 'weighted rating calculation'
lists_movies = df2.copy().loc[df2['vote_count'] >= m]
lists_movies['rate'] = lists_movies.apply(weighted_rating, axis=1)

low_20_rate = lists_movies['rate'].quantile(0.8)
do_not_recommend.append(lists_movies['title_x'].copy().loc[lists_movies['rate'] <= low_20_rate])

"""
Recommendation System based on OVERVIEW
"""

# based on description (= column 'overview') to find movie similarity
# Remove all english stop words such as 'the', 'a', ...
tfidf = TfidfVectorizer(stop_words='english')
# Replace NaN with an empty string
df2['overview'] = df2['overview'].fillna('')
# Construct the required TF(Term Frequency)-IDF matrix by fitting and transforming data
tfidf_matrix = tfidf.fit_transform(df2['overview'])

# Output the shape of tfidf_matrix
#tfidf_matrix.shape : (4803, 20978) => 4803 movies, 20978 words

# Compute the cosine similarity matrix
cosine_sim_overview = linear_kernel(tfidf_matrix, tfidf_matrix)

"""
Recommendation System based on Genre, Keywords, Crew, Cast
"""
# Clean data (cast, crew, keywords, genre are currently in a complicated dict form)
features = ['cast', 'crew', 'keywords', 'genres']
for feature in features:
    df2[feature] = df2[feature].apply(literal_eval)

# Get the director's name from crew feature. If not listed, return NaN
def get_director(x):
    for i in x:
        if i['job'] == 'Director':
            return i['name']
    return np.nan

# using only at most 3 people in 'cast'
# Return the max 3 elements of list x : whichever is more 
def get_three(x):
    if isinstance(x, list):
        names = [i['name'] for i in x]
        if len(names) > 3:
            names = names[:3]
        return names
    # return empty list if data missing
    return []

# Return max 5 elements
def get_five(x):
    if isinstance(x, list):
        names = [i['name'] for i in x]
        if len(names) > 5:
            names = names[:5]
        return names
    # return empty list if data missing
    return []

# Now the data is in clean format. ex) [Action, Adventure, Fantasy]
df2['director'] = df2['crew'].apply(get_director)
df2['cast'] = df2['cast'].apply(get_five)
df2['keywords'] = df2['keywords'].apply(get_five)
df2['genres'] = df2['genres'].apply(get_three)

# Clean Data : Remove all the spaces and convert capital letter to small ones
def clean_data(x):
    if isinstance(x, list):
        return [str.lower(i.replace(" ", "")) for i in x]
    else:
        if isinstance(x, str):
            return str.lower(x.replace(" ", ""))
        else:
            return ''

features = ['cast', 'keywords', 'genres', 'director']
for feature in features:
    df2[feature] = df2[feature].apply(clean_data)

# Create Metadata
def create_soup(x):
    return ' '.join(x['keywords']) + ' ' + ' '.join(x['cast']) + ' ' + x['director'] + ' ' + ' '.join(x['genres'])
df2['soup'] = df2.apply(create_soup, axis=1)
count = CountVectorizer(stop_words='english')
count_matrix = count.fit_transform(df2['soup'])

cosine_sim_feature = cosine_similarity(count_matrix, count_matrix)

"""
Generate RECOMMENDATION
"""

# Reset index of our main DataFrame and construct reverse mapping as before
df2 = df2.reset_index()
# Construct a reverse map of indices and movie titles
indices = pd.Series(df2.index, index=df2['title_x']).drop_duplicates()


def get_recommendations(title):
    #[[1. 0.3 ...][0.3 1. 0.2 ...]]
    idx = indices[title]

    feature_matrix = np.matrix(cosine_sim_feature)
    overview_matrix = np.matrix(cosine_sim_overview)
    final_matrix = feature_matrix+overview_matrix

    final_series = pd.DataFrame(np.array(final_matrix)).stack()

    # [(0, 0.0), (1, 0.1), ...]
    sim_scores = list(enumerate(final_series[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)

    sim_scores = sim_scores[1:11]
    movie_indices = [i[0] for i in sim_scores]

    result = df2['title_x'].iloc[movie_indices]

    # Delete the ones in do_not_recommend

    return result

#print("_________________________")
print(get_recommendations('Titanic'))

"""
Seach 'JFK'
COMBINED
884                Zero Dark Thirty
1528                       Criminal
647              World Trade Center
737       Jack Ryan: Shadow Recruit
2008          In the Valley of Elah
2141                           Milk
1049                  Patriot Games
4475    Interview with the Assassin
477                   Thirteen Days
940                         Syriana

FEATURE BASED
884              Zero Dark Thirty
1528                     Criminal
647            World Trade Center
737     Jack Ryan: Shadow Recruit
2008        In the Valley of Elah
3172                The Contender
940                       Syriana
991                     Fair Game
1091                        Nixon
1187              Bridge of Spies

OVERVIEW BASED
2507                Slow Burn
879       Law Abiding Citizen
2020               The Rookie
2193     Secret in Their Eyes
2697                    Bobby
753              The Sentinel
1202             Legal Eagles
817          American Wedding
65            The Dark Knight
3       The Dark Knight Rises
"""