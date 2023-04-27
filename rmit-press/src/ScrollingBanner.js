
import React from 'react';

//<div className="index-img"><img src={this.state.img}/></div>
//<div className="index-line"><span className="times">{this.state.id} - </span><span className="helvetica" onMouseOver={() => this.testHover()}>{this.state.title}</span></div>
class ScrollingBanner extends React.Component {
    constructor(props){
      super(props);
      this.state = {
        buttonTitles: ["Home", "About", "Contact", "Help"]
      };

      window.addEventListener('click', (event) => {
        console.log("CLICKEDDD");
        if(Math.random() < .25){
          let selectionPos = Math.floor(Math.random() * this.state.buttonTitles.length);
          console.log(`selectionPos: ${selectionPos}`);
          this.doSynonym(selectionPos, this.state.buttonTitles[selectionPos]);
        }
      });
    }

    async doSynonym(index, word){
      const resp = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`)
      .then(response => response.json())
      .then(data => {;

        if(data != null){
          console.log(JSON.stringify(data));
          let newWord = data[Math.floor(Math.random() * data.length)]["word"];
          //let newWord = data[0]["word"];
          console.log(`${index} / ${word} DID SYNONYM: ${newWord}`);
  
          let responseButtonTitles = this.state.buttonTitles;
          responseButtonTitles[index] = newWord;
  
          this.setState({
            buttonTitles: responseButtonTitles
          });

          console.log("buttonTitles: "+ this.state.buttonTitles);
        }
      })
      /*
      .then(response => response.json())
      .then(data => {
        console.log(data);
        console.log(JSON.stringify(data));
        
  
        return data; 
      })
      .catch(error => console.log("ERR: " + error));*/
    }

    render() {
      let elements = []
      for(var i = 0; i < this.state.buttonTitles.length; i++){
        elements.push(<div className="scrolling-banner-child" style={{
          //backgroundColor: `${(i % 2 == 0 ? "white" : "grey")}`
          //borderColor: `${(i % 2 == 0 ? "white" : "grey")}`
          //borderColor: `${(i % 2 == 0 ? "#ededed" : "#dedede")}`
          borderColor: `${(i % 2 == 0 ? "grey" : "grey")}`
        }}><p className="times">{this.state.buttonTitles[i].charAt(0).toUpperCase() + this.state.buttonTitles[i].slice(1)}</p></div>);
      }
      return(<div className="scrolling-banner-parent">
                {elements}
              </div>)
    }
  }
  
  export default ScrollingBanner;