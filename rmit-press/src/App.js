import logo from './logo.svg';
import './App.css';
import baseHoverImg from "./Img/icon.png";
import imgOne from "./Img/Screenshot_1.png";
import imgTwo from "./Img/icarus1.jpg";
import mask from "./Img/SquareMask.png";
import ArtPiece from "./ArtPiece";
import React from 'react';

import paperText1 from "./Img/test-paper-texture.png";
import paperText2 from "./Img/test-paper-texture-2.png";
import paperText3 from "./Img/test-paper-texture-3.png";
import paperText4 from "./Img/test-paper-texture-4.png";
import paperText5 from "./Img/test-paper-texture-5.png";

class App extends React.Component {
  constructor(props){
    super(props);

    this.paperTextures = [paperText1, paperText2, paperText3, paperText4, paperText5];
    //this.currPaperTexture = 0;
    this.testHover = this.testHover.bind(this);
    this.clearHover = this.clearHover.bind(this);

    this.state={
      baseHoverImg: baseHoverImg,
      currHoverImg: null,
      currPaperTexture: 0
    }
    
    setInterval(() => {
      console.log("hello world : " + this.currPaperTexture);
      this.setState((prevState) => {
        return{
          currPaperTexture: (this.state.currPaperTexture + 1) % this.paperTextures.length
        };
      });
    }, 100);   
  }

  testHover(props){
    var e = window.event;

    var posX = e.clientX;
    var posY = e.clientY;

    const textElement = document.getElementById(props.id);
    var textRect = textElement.getBoundingClientRect();
    //console.log(textRect.top, textRect.right, textRect.bottom, textRect.left); //mostly interested in top/left

    var minNormX = textRect.right - textRect.left;
    var cursorNormX = posX - textRect.left;

    var minNormY = textRect.bottom - textRect.top;
    var cursorNormY = posY - textRect.top;

    console.log(`mouse pos: ${posX} - ${posY}, that means width=${(cursorNormX / minNormX) * 100}%, height=${(cursorNormY / minNormY) * 100}%`);
    console.log("inner APP hover works: " + JSON.stringify(props));

    this.setState({currHoverImg: props.img, 
      mouseRelativeXPercent: (cursorNormX / minNormX) * 100,
      mouseRelativeYPercent: (cursorNormY / minNormY) * 100
    });
  }

  clearHover(props){
    console.log("inner APP hover works: " + JSON.stringify(props));
    this.setState({currHoverImg: null});
  }

  getFullIndex(props){
    let list = []
    for(var i = 0; i< 50; i++){
      let img = i % 2 == 0 ? imgOne : imgTwo;
      list.push(<dt className="index-dt"><img src={img} className="index-tiny-img"/><p className="index-times">{i.toString().padStart(3, '0')}</p></dt>);
    }

    return(
        <div className="index-right">
          <dl>
            {list}
          </dl>
        </div>
    );
  }
  
  render() {
    var maskPosition = `center`
    
    //Whatever is shown when no image is being hovered
    var backgroundStyle = {
      

      }

    if(this.state.currHoverImg != null){
    //if(this.state.mouseRelativeXPercent != null && this.state.mouseRelativeYPercent != null){
      maskPosition = `${this.state.mouseRelativeXPercent}% ${this.state.mouseRelativeYPercent}%`;

      backgroundStyle = {
        backgroundImage: `url(${this.state.currHoverImg})`,
        "WebkitMaskImage": `url(${mask})`,
        maskImage: `url(${mask})`,

        "WebkitMaskSize": "33%",
        maskSize: "33%",

        "WebkitMaskPosition": `${maskPosition}`,
        maskPosition: `${maskPosition}`
      }
    }



    return (
      <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="stylesheet" href="styles.css" />
        <link rel="icon" href="icon.png" /> 
        <title>Zachariah Micallef</title>
        <header>
          <span className="times">Bachelor of Design (Communication Design).</span>
          <span className="helvetica"> Graduate Exhibition. June 15.</span>
          <span className="times">Bowen Street. (Event is Wheelchair Accessible)</span>
        </header>
        <footer>
          <span className="helvetica">www.rmit.edu.au</span>
          <br />
          <span className="helvetica">www.instagram.com/designrmit</span>
        </footer>  
        <div className="index-main-BG" style={backgroundStyle}></div>
        <div className="index-main-paper" style={{backgroundImage: `url(${this.paperTextures[this.state.currPaperTexture]})`}}></div>
        <div className="index-main" >
          <div className="index-content"> 
            <ArtPiece hoverOverTextFunc={this.testHover} hoverExitTextFunc={this.clearHover} id="001" img={imgOne} title="Nicholas Gleeson, Arpeggiated Visualiser, 2023."/>
            <ArtPiece hoverOverTextFunc={this.testHover} hoverExitTextFunc={this.clearHover} id="002" img={imgTwo} title="Zach Micallef, Icarus, 2023."/>            
          </div>
        </div>
        <this.getFullIndex/>
      </div>
    );
  }
}

export default App;
