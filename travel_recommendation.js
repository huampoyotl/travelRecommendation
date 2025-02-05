var apiData=null;

document.getElementById('btnSearch').addEventListener('click',searchAPI);
document.getElementById('btnClear').addEventListener('click',clearResults);

document.querySelectorAll('form').forEach(form => {
	form.onsubmit = event => event.preventDefault();
});

fetch('travel_recommendation_api.json',{
		'Content-Type': 'application/json'
	})
	.then(response => response.json())
	.then(data => {
		apiData=data;
	})
	.catch( error => {
		console.log(error);
	});

function searchAPI(){
	if(apiData==null){
		document.getElementById('results').innerHTML='<p class="error">Data has not been retreived, try later.</p>';
		document.getElementById('results').classList.add('shown');
		setTimeout(function(){
			document.getElementById('results').classList.remove('shown');
			document.getElementById('results').innerHTML='';
		},1500);
	}else{
		let searchTerm=document.getElementById('searchInput').value;
		searchTerm=searchTerm.trim().toLowerCase();
		if(searchTerm.length>0){
			let results=new Array();
			let timeZone=false;
			for (var k in apiData) {
				// search of keyword
				if(k.toLowerCase().indexOf(searchTerm)>=0 && k!=="countries"){
					for (let i = 0; i < apiData[k].length; i++) {
						let card=recommendationCard(apiData[k][i]);
						timeZone=apiData[k][i].timeZone;
						results.push(card);
					}
				}
				for (let i = 0; i < apiData[k].length; i++) {
					if(apiData[k][i].name.toLowerCase().indexOf(searchTerm)>=0){
						if(k=="countries"){
							for (let j = 0; j < apiData[k][i].cities.length; j++) {
								let card=recommendationCard(apiData[k][i].cities[j]);
								timeZone=apiData[k][i].cities[j].timeZone;
								results.push(card);
							}
						}else{
							let card=recommendationCard(apiData[k][i]);
							timeZone=apiData[k][i].timeZone;
							results.push(card);
						}
					}
				}
			}
			for (let i = 0; i < apiData.countries.length; i++) {
				for (let j = 0; j < apiData.countries[i].cities.length; j++) {
					if(apiData.countries[i].cities[j].name.toLowerCase().indexOf(searchTerm)>=0){
						let card=recommendationCard(apiData.countries[i].cities[j]);
						timeZone=apiData.countries[i].cities[j].timeZone;
						results.push(card);
					}
				}
			}
			if(results.length==0){
				document.getElementById('results').innerHTML='<p class="error">Not results were found.</p>';
				setTimeout(function(){
					document.getElementById('results').classList.remove('shown');
					document.getElementById('results').innerHTML='';
				},1500);
			}else{
				if(results.length==1){
					let options = { timeZone: timeZone, hour12: true, hour: 'numeric', minute: 'numeric', second: 'numeric' };
					let time=new Date().toLocaleTimeString('en-US', options);
					document.getElementById('results').innerHTML='<p class="time">Current time: '+time+'</p>'
						+results.join('');
				}else{
					document.getElementById('results').innerHTML=results.join('');
				}
			}
			document.getElementById('results').classList.add('shown');
		}else{
			document.getElementById('results').innerHTML='<p class="error">Enter a destination or keyword.</p>';
			document.getElementById('results').classList.add('shown');
			setTimeout(function(){
				document.getElementById('results').classList.remove('shown');
				document.getElementById('results').innerHTML='';
			},1500);
		}
	}
}

function recommendationCard(place){
	let card='<div class="result">'
	+'<div class="image"><img src="'+place.imageUrl+'"/></div>'
	+'<h3>'+place.name+'</h3>'
	+'<p>'+place.description+'</p>'
	+'<button>Visit</button>'
	+'</div>'
	return card;
}

function clearResults(){
	document.getElementById('results').classList.remove('shown');
	document.getElementById('results').innerHTML='';
	document.getElementById('searchInput').value='';
}