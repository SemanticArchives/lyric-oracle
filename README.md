lyric-oracle
============

The purpose of this project is to build a generalizable workflow that will scan a MongoDB and submit salient content to OpenCalais for semantic processing, then add meaningful metadata back into the original Mongo document.

Currently it works for a subset of this use case, on lyrics for an archive we are developing.

Functional operation requires the creation of an `api_key.js` doc in the root directory with an OpenCalais API key (you can get this instantly by registering on OpenCalais.com). Your `api_key.js` should look like this:

`module.exports.Key = "[YourKeyHere]";`

Assuming you have this, and a MongoDB entitled "lyrics" with some lyrics in it, you should be set to go. At this point, you'll have to scan the code to get things in the right format. Work in progress.
