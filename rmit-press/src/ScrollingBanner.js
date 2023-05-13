
import React from 'react';

//<div className="index-img"><img src={this.state.img}/></div>
//<div className="index-line"><span className="times">{this.state.id} - </span><span className="helvetica" onMouseOver={() => this.testHover()}>{this.state.title}</span></div>
class ScrollingBanner extends React.Component {
    constructor(props){
      super(props);
      //console.log("(changeCurrentPageIndex) ScrollingBanner: " + JSON.stringify(props));
      this.state = {
        buttonTitles: ["Home", "About", "Contact", "Help"],
        clickFunc: props.clickFunc,
        currentPageIndex: 0,
      };

      window.addEventListener('click', (event) => {
        //console.log("CLICKEDDD");
        if(Math.random() < .15){
          let selectionPos = Math.floor(Math.random() * this.state.buttonTitles.length);
          //console.log(`selectionPos: ${selectionPos}`);
          this.doSynonym(selectionPos, this.state.buttonTitles[selectionPos]);
        }
      });
    }

    componentDidMount(){
      //console.log("ScrollingBanner/componentDidMount: " + JSON.stringify(this.props));
    }

    async doSynonym(index, word){
      //console.log("do synonym");
      const resp = await fetch(`https://api.datamuse.com/words?rel_syn=${word}`)
      .then(response => response.json())
      .then(data => {;

        if(data != null){// && data["word"] != null){
          //console.log(JSON.stringify(data));
          let newWord = data[Math.floor(Math.random() * data.length)]["word"];
          //let newWord = data[0]["word"];
          //console.log(`${index} / ${word} DID SYNONYM: ${newWord}`);
  
          let responseButtonTitles = this.state.buttonTitles;
          responseButtonTitles[index] = newWord;

          //console.log(`responseButtonTitles: ${JSON.stringify(responseButtonTitles)}`);
  
          this.setState({
            buttonTitles: responseButtonTitles
          });

          //console.log("buttonTitles: "+ this.state.buttonTitles);
        }
      })
    }

    changeCurrentPageIndex(id){
      if(this.state.clickFunc == null){// || this.state.clickFunc.current == null){
        return;
      }
      
      let editedClickFunc = this.state.clickFunc;
      editedClickFunc.current = id;
      if(id == 3){
        window.history.pushState("object or string", "Title", "/help");
      }else{
        window.history.pushState("object or string", "Title", "/");
      }

      this.setState={
        currentPageIndex: id,
        clickFunc: editedClickFunc,
      }
    }

    render() {
      //console.log("CHECK CLICKFUN: " + JSON.stringify(this.state.clickFunc))
      let elements = []
      for(var i = 0; i < this.state.buttonTitles.length; i++){
        let j = i; /* lol */
        elements.push(<div key={i} className="scrolling-banner-child" onClick = {(() => this.changeCurrentPageIndex(j))} style={{
        }}><p className="helvetica">{i == this.state.clickFunc.current ? " " : (this.state.buttonTitles[i].charAt(0).toUpperCase() + this.state.buttonTitles[i].slice(1))}</p></div>);
      }
      return(<div className="scrolling-banner-parent">
                {elements}
              </div>)
    }
  }
  
  export default ScrollingBanner;