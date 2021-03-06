Feedlark:tm: Aggregator
================

Dependencies
------------

- Python 2.7
- pymongo
- gearman
- Feedlark Adder
- Feedlark Getter
- spacy

aggregator.py
-------------

This is the code that ties the three Feedlark databases together, it coalesces `feed` and `user` and places the data in `g2g`.
The machine learning components will be put here eventually to decide the order of the items but for now they sorted by a combination of date and keyword crossover.

The `aggregate` worker takes BSON encoded data in the form:

```js
{
    'key': 'secret_key_abc',
}
```

And returns
```js
{
    'status': 'ok',
}
```

or
```js
{
    'status': 'error',
    'description': 'Super helpful error message'
}
```

kw_score.py
-----------

This directory also includes `kw_score.py` which provides two functions, `score` and `fast_score` to measure the crossover between the keywords of an article and a user's interests.
The functions assign the articles a score between -1 and 1 which can be used to help judge what articles a user may prefer. Higher is better.

The `score` function uses word vectors to find which words in the users list match up best with the keywords in the article and generates a score based on those.
The `fast_score` function checks for any words common to both the users words and the article's keywords, this is faster but less general.

The `score` and `fast_score` Gearman workers take BSON encoded data in the form:

```js
{
    'key': 'secret_key_abc',
	'article_words': {'word1':0.3, 'word2':0.1, 'wordn':0.4},
	'user_words': {'space':44, 'truckin':12, 'gardening':-10},
}
```

And return

```js
{
	"status":"ok",
	"score":0.7821,
}
```
or
```js
{
	"status":"error",
	"description":"Somethin' bad happened bro, here's where I tell you about it"
}
```


How to do tests
---------------

The tests are written with the unittest module in python.

To run them make sure you have all the dependencies and the dbtools are running then run:

	$ python testing.py


To add unit tests modify the testing.py file.
Check out the unittest docs for examples and general help.
