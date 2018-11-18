// content of index.js
const http = require('http');
const port = 3000;

const requestHandler = (request, response) => {
    console.log(request.url)
    response.end('Hello Node.js Server!')
};

const server = http.createServer(requestHandler);
const articles = {
	suicide:{
		url:new URL("https://kidshelpphone.ca/get-info/how-cope-thoughts-suicide/"),
		keyphrases:["suicide", "kill myself"]
	},
	anorexia:{
		url:new URL("https://kidshelpphone.ca/get-info/eating-disorders-tips-recovery/"),
		keyphrases:["anorexi", "bulimi", "eating disorder"]
	},
	comingout:{
		url:new URL("https://kidshelpphone.ca/get-info/identifying-lgbtq-and-coming-out/"),
		keyphrases:["come out", "coming out"]
	},
	bullying:{
		url:new URL("https://kidshelpphone.ca/get-info/what-do-if-youre-experiencing-bullying/"),
		keyphrases:["bully"]
	}
}

function getMostRelevantArticle(text){
	text = text.toLowerCase()
	let mutableArticles = JSON.parse(JSON.stringify(articles))
	for(let article of Object.values(mutableArticles)){
		for(const keyphrase of article.keyphrases){
			const hits = text.split(keyphrase).length - 1
			if(!("hits" in article)) article.hits = 0
			article.hits += hits
		}
	}
	let mostRelevantArticle = ""
	let maxHits = 0
	for(let article of Object.values(mutableArticles)){
		if(article.hits > maxHits){
			mostRelevantArticle = article.url
			maxHits = article.hits
		}
	}
	return mostRelevantArticle
}

server.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
    var input = "Im going to kill myself. . and i just want to know one thing, do you think that there are just some people who are just to far gone to be saved? be honest. ANOREXIA"
	var result = getMostRelevantArticle(input)
    console.log(result)


});