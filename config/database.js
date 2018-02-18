if(process.env.NODE_ENV === 'production')
{
	module.exports = {mongoURI: 'mongodb://hsiungsc:New2White@ds239638.mlab.com:39638/mything-prod'};
}
else
{
	module.exports = {mongoURI: 'mongodb://localhost/mythings'};
}