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
	familyabuse:{
		url:new URL("https://kidshelpphone.ca/get-info/dealing-family-abuse-how-get-help-and-stay-safe/"),
		keyphrases:["parents abus", "dad abus", "mom abus", "parents hit", "dad hit", "mom hit", "parents beat", "dad beat", "mom beat"]
	},
	anorexia:{
		url:new URL("https://kidshelpphone.ca/get-info/eating-disorders-tips-recovery/"),
		keyphrases:["anorexi", "bulimi", "eating disorder"]
	},
	bullying:{
		url:new URL("https://kidshelpphone.ca/get-info/what-do-if-youre-experiencing-bullying/"),
		keyphrases:["bully", "bulli", "teas", "making fun of", "make fun of"]
	},
	comingout:{
		url:new URL("https://kidshelpphone.ca/get-info/identifying-lgbtq-and-coming-out/"),
		keyphrases:["come out", "coming out"]
	},
	loneliness:{
		url:new URL("https://kidshelpphone.ca/get-info/feeling-lonely-here-are-some-ways-feel-better/"),
		keyphrases:["lonel", "alone"]
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
    var input = "Im going to kill myself. . and i just want to know one thing, do you think that there are just some people who are just to far gone to be saved? be honest. ANOREXIA. I feel so lonely, very very alone"
	var result = getMostRelevantArticle(input)
    console.log(result)


});