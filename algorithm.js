const articles = {
	suicide:{
		url: "https://kidshelpphone.ca/get-info/how-cope-thoughts-suicide/",
		keyphrases:["suicid", "kill myself"]
	},
	anorexia:{
		url: "https://kidshelpphone.ca/get-info/eating-disorders-tips-recovery/",
		keyphrases:["anorexi", "bulimi", "eating disorder"]
	},
	comingout:{
		url: "https://kidshelpphone.ca/get-info/identifying-lgbtq-and-coming-out/",
		keyphrases:["come out", "coming out"]
	},
	bullying:{
		url: "https://kidshelpphone.ca/get-info/what-do-if-youre-experiencing-bullying/",
		keyphrases:["bully", "bulli"]
	},
	loneliness:{
		url: "https://kidshelpphone.ca/get-info/feeling-lonely-here-are-some-ways-feel-better/",
		keyphrases:["lonel", "alone"]
	}
}

exports.getMostRelevantArticle = (text) => {
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
