let learningDB = [];

export function recordLearning(query, result){

learningDB.push({
query,
result,
time:Date.now()
});

}

export function findSimilarQuery(query){

const match = learningDB.find(q => q.query === query);

if(match){
return match.result;
}

return null;

}

export function getLearningData(){
return learningDB;
}
