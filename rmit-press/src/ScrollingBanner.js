
import React from 'react';

//<div className="index-img"><img src={this.state.img}/></div>
//<div className="index-line"><span className="times">{this.state.id} - </span><span className="helvetica" onMouseOver={() => this.testHover()}>{this.state.title}</span></div>
class ScrollingBanner extends React.Component {
    constructor(props){
      super(props);
      console.log("(changeCurrentPageIndex) ScrollingBanner: " + JSON.stringify(props));
      this.state = {
        buttonTitles: ["Home", "About", "Contact", "Help"],
        clickFunc: props.clickFunc,
        currentPageIndex: 0,
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

    componentDidMount(){
      console.log("ScrollingBanner/componentDidMount: " + JSON.stringify(this.props));
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

    changeCurrentPageIndex(id){
      console.log("--------------changeCurrentPageIndex----------------" );
      console.log("changeCurrentPageIndex: " + id);
      console.log(`changeCurrentPageIndex STATE: ${JSON.stringify(this.state)}`);
      console.log(`changeCurrentPageIndex STATE.clickFunc: ${JSON.stringify(this.state.clickFunc)}`);

      if(this.state.clickFunc == null){// || this.state.clickFunc.current == null){
        console.log("changeCurrentPageIndex: EXIT EARLY");
        return;
      }
      
      
      let editedClickFunc = this.state.clickFunc;
      editedClickFunc.current = id;
      //this.setState.clickFunc.current = editedClickFunc.current;
      console.log(`changeCurrentPageIndex this.state.clickFunc: ${JSON.stringify(this.state.clickFunc)}`);
      console.log(`changeCurrentPageIndex editedClickFunc: ${JSON.stringify(editedClickFunc)}`);
      this.setState={
        clickFunc: editedClickFunc,
      }
      console.log(`changeCurrentPageIndex END STATE: ${JSON.stringify(this.state)}`);
    }
//onClick = {console.log("hhasfhhasf")} 
//onClick = {this.props.clickFunc}
    render() {
      let elements = []
      for(var i = 0; i < this.state.buttonTitles.length; i++){
        let j = i;
        elements.push(<div className="scrolling-banner-child" onClick = {(() => this.changeCurrentPageIndex(j))} style={{
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