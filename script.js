const You= {'span':'#your-result','div':'.your-box','score':0}
const Dealer= {'span':'#dealer-result','div':'.dealer-box','score':0}
var cards=['2','3','4','5','6','7','8','9','10','K','Q','J','A']
var cardvalue={'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'K':10,'Q':10,'J':10,'A':11}
var table={'wins':0,'losses':0,'draws':0,'isStand': false,'turnover': false,'ishit':false}


const hitsound=new Audio('sounds/swish.m4a')
const winsound=new Audio('sounds/cash.mp3')
const losssound=new Audio('sounds/aww.mp3')

document.querySelector('#hit-btn').addEventListener('click',hitfun);
document.querySelector('#deal-btn').addEventListener('click',dealfun);
document.querySelector('#stand-btn').addEventListener('click',dealplay);

function hitfun(){
    if(table['isStand'] === false){
        let card =randomval()
        showcard(card,You);
        updatescore(card,You)
        showScore(You);
        table['ishit']=true;
    }
}

function showcard(card,active){
    if(active['score']<=21){
    var cardimg = document.createElement('img');
    cardimg.src='images/' + card +'.png';
    document.querySelector(active['div']).appendChild(cardimg);
    hitsound.play()
    }
}

function randomval(){
    let index=Math.floor(Math.random()*13);
    return cards[index]
}

function dealfun(){
    if(table['turnover'] === true){
        let yourimg= document.querySelector('.your-box').querySelectorAll('img');
        let dealerimg= document.querySelector('.dealer-box').querySelectorAll('img');
        for(let i=0;i<yourimg.length;i++){
            yourimg[i].remove(); 
        }
        for(let i=0;i<dealerimg.length;i++){
            dealerimg[i].remove(); 
        }   
        You['score']=0;
        Dealer['score']=0;

        document.querySelector('#your-result').textContent = 0;
        document.querySelector('#dealer-result').textContent = 0;
        document.querySelector('#your-result').style.color='black';
        document.querySelector('#dealer-result').style.color='black';

        document.querySelector('#result').textContent="Let's Play!!";
        document.querySelector('#result').style.color='black';
        table['isStand']=false;
        table['turnover']=false;
    }
}

function updatescore(card,active){
    if(card=='A'){
        if(active['score'] +cardvalue['A']<=21){
            active['score'] += cardvalue[card]
        }else{
            active['score'] += 1
        }
    }
    else {
        active['score'] += cardvalue[card]
    }
}

function showScore(active){
    if(active['score']>21){
        document.querySelector(active['span']).textContent='Burst!' 
        document.querySelector(active['span']).style.color='red'
    }else{
    document.querySelector(active['span']).textContent= active['score']
    }
}

function sleep(ms){
    return new Promise(resolve => setTimeout(resolve,ms))
}



async function dealplay(){
    if(table['turnover']===false && table['ishit']===true){
        table['isStand']=true;

        while(Dealer['score']<16 && table['isStand']===true){
        let card =randomval()
        showcard(card,Dealer);
        updatescore(card,Dealer)
        showScore(Dealer);
        await sleep(1000);
        }
        
        table['turnover'] = true;
        let winner=computewin();
        showwinner(winner);
    }
}

function computewin(){
    var winner;
    if(You['score']<=21){
        if(You['score']>Dealer['score'] || Dealer['score']>21){
            table['wins']++;
            winner=You;
        }else if(You['score'] === Dealer['score']){
            table['draws']++
        }else if(Dealer['score']>You['score']){
            table['losses']++
            winner=Dealer;
        }
    }else if(You['score']>21 && Dealer['score']>21){
        table['draws']++
    }else if(You['score']>21 && Dealer['score']<=21){
        table['losses']++
        winner=Dealer
    }
    return winner;
}

function showwinner(winner){
    let msg;
    let msgcolor;
    if(winner == You){
        document.querySelector('#wins').textContent=table['wins'];
        msg='You Won!'
        msgcolor='green'
        winsound.play();

    }else if(winner == Dealer){
        document.querySelector('#losses').textContent=table['losses'];
        msg='You Lost!'
        msgcolor='red'
        losssound.play();
    }else{
        document.querySelector('#draws').textContent=table['draws'];
        msg='You Drew!'
        msgcolor='black'
    }

    document.querySelector('#result').textContent=msg;
    document.querySelector('#result').style.color=msgcolor;
}