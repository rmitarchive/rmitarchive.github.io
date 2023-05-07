import './App.css';
import baseHoverImg from "./Img/icon.png";
import mask from "./Img/SquareMask.png";
import ArtPiece from "./ArtPiece";
import HelpText from "./HelpText";
import ScrollingBanner from "./ScrollingBanner";
import ThreeJS from "./ThreeJS";
import React from 'react';

import ClassJSON from "./Data/class.json"

import paperText1 from "./Img/test-paper-texture.png";
import paperText2 from "./Img/test-paper-texture-2.png";
import paperText3 from "./Img/test-paper-texture-3.png";
import paperText4 from "./Img/test-paper-texture-4.png";
import paperText5 from "./Img/test-paper-texture-5.png";

import axios from 'axios';
//import { Page, Text, View, Document, StyleSheet, ReactPDF } from '@react-pdf/renderer';
//https://medium.com/craftcode-design/how-to-build-a-contact-form-with-react-js-and-php-d5977c17fec0
//<marquee behavior="alternate">Test test test</marquee>
class App extends React.Component {
  constructor(props){
    super(props);

    this.paperTextures = [paperText1, paperText2, paperText3, paperText4, paperText5];
    
    this.testHover = this.testHover.bind(this); //currently empty funcs, since we arent doing that any more
    this.clearHover = this.clearHover.bind(this); //currently empty funcs, since we arent doing that any more

    this.startDragElement = this.startDragElement.bind(this);
    this.stopDragElement = this.stopDragElement.bind(this);
    this.continueDragElement = this.continueDragElement.bind(this);
    this.clickText = this.clickText.bind(this);

    this.incrementZIndex = this.incrementZIndex.bind(this);

    let path = window.location.pathname;
    this.scrollbarRef = React.createRef();

    var artPiecesOffsetX = [];
    var artPiecesOffsetY = [];
    var artPiecesCurrX = [];
    var artPiecesCurrY = [];

    var artPiecesImageShown = [];
    var artPiecesImageMoved = [];
    var artPiecesImageMoving = [];

    var artPiecesCuzzZIndex = [];

    var artPiecesIsVisible = [];
    var currentShownWorks = [];

    ClassJSON.students.forEach(student => {
      artPiecesOffsetX.push(0);
      artPiecesOffsetY.push(0);
      artPiecesCurrX.push(0);
      artPiecesCurrY.push(0);
      artPiecesCuzzZIndex.push(10);

      artPiecesImageShown.push(false);
      artPiecesImageMoved.push(false);
      artPiecesImageMoving.push(false);
      artPiecesIsVisible.push(student.name != "sys");
    });

    if(path.toUpperCase().includes("HELP")){
      this.scrollbarRef.current = 3;
    }else{
      this.scrollbarRef.current = 0;
    }

    window.addEventListener('mousemove', (event) => {
      this.setState({
        mouseXWas: this.state.mouseX,
        mouseYWas: this.state.mouseY,
        mouseX: event.clientX,
        mouseY: event.clientY
      });
    });
/*
    window.addEventListener('resize', (event) => {
      this.setState({
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight
      });
    });
    */
    this.state={
      baseHoverImg: baseHoverImg,
      currHoverImg: null,
      currPaperTexture: 0,
      mouseRelativeXPercent: 0,
      mouseRelativeYPercent: 0,
      
      lastFactX: false,
      mouseX: 0,
      mouseY: 0,
      mouseXWas: 0,
      mouseYWas: 0,
      mathFact: [null, null, null, null],
      indexFilter: {
        digital: false,
        identity: false,
        logo: false,
        print: false,
        poster: false,
        layout: false,
        web: false
      },

      textFilter : "",

      artPiecesOffsetX: artPiecesOffsetX,
      artPiecesOffsetY: artPiecesOffsetY,
      artPiecesCurrX: artPiecesCurrX,
      artPiecesCurrY: artPiecesCurrY,

      artPiecesImageShown: artPiecesImageShown,
      artPiecesImageMoved: artPiecesImageMoved,
      artPiecesImageMoving: artPiecesImageMoving,

      artPiecesCuzzZIndex: artPiecesCuzzZIndex,
      artPiecesSpawned: artPiecesCuzzZIndex,

      artPiecesIsVisible: artPiecesIsVisible,

      baseZIndex: 10,
      gridSnap: true,    

      currentShownWorks: currentShownWorks
    }    

    setInterval(() => {
      this.getFunFact(this.state.lastFactX ? this.state.mouseX : this.state.mouseY);
    }, 500);

    window.addEventListener('click', (event) => {
      if(Math.random() < .25){
        this.showRandomImage();
      }
    });

    setInterval(() => {
      let newCurrPaperTexture = Math.floor(Math.random() * this.paperTextures.length);
      //console.log("newCurrPaperTexture: " + newCurrPaperTexture);
      this.setState((prevState) => {
        return{
          //currPaperTexture: (this.state.currPaperTexture + 1) % this.paperTextures.length
          currPaperTexture: newCurrPaperTexture
        };
      });
    }, 250);   
  }

  showRandomImage(){
    let pos = 0;
    let pot = [];
    ClassJSON.students.forEach(student => {
      if(student.name == "sys" && this.state.artPiecesIsVisible[pos] == false){
        pot.push(pos);
      }

      pos++;
    });

    if(pot.length != 0)
    {

      let randIndex = Math.floor(Math.random() * pot.length);

      let newArtPiecesIsVisible = this.state.artPiecesIsVisible;
      newArtPiecesIsVisible[pot[randIndex]] = true;
  
      let newArtPiecesImageShown = this.state.artPiecesImageShown;
      newArtPiecesImageShown[pot[randIndex]] = true;
  
      let newArtPiecesImageMoved = this.state.artPiecesImageMoved;
      newArtPiecesImageMoved[pot[randIndex]] = true;
  
      const textElement = document.getElementById(`root`);
      let textRect = textElement.getBoundingClientRect();
  
      let newArtPiecesCurrX = this.state.artPiecesCurrX;
      let width = textRect.right;
      newArtPiecesCurrX[pot[randIndex]] = (Math.random() * (width * .6)) + (width * .4);
  
      let newArtPiecesCurrY = this.state.artPiecesCurrY;
      let height = textRect.bottom;
      newArtPiecesCurrY[pot[randIndex]] = (Math.random() * (height * .6)) + (height * .4);
  
      //console.log(`SHOW RANDOM IMAGE ${pot[randIndex]} `);
  
      this.setState({
        artPiecesIsVisible: newArtPiecesIsVisible,
        artPiecesImageShown: newArtPiecesImageShown,
        artPiecesImageMoved: newArtPiecesImageMoved,
        artPiecesCurrX: newArtPiecesCurrX,
        artPiecesCurrY: newArtPiecesCurrY,
      });
    }else{
      //console.log("NO IMAGES")
    }
  }


  incrementZIndex() {
    let newZIndex = this.state.baseZIndex + 1;
    
    this.setState({
      baseZIndex: newZIndex
    })

    return newZIndex;
  }

  clickText(props) {
    //console.log("MOUSE DOWN");
    let newArtPiecesImageShown = this.state.artPiecesImageShown;
    newArtPiecesImageShown[props.coreInfo.id] = !newArtPiecesImageShown[props.coreInfo.id];

    //console.log(newArtPiecesImageShown);
    //console.log(this.state);

    if(!newArtPiecesImageShown[props.coreInfo.id]){
      this.removeFromCurrentlyShownWorks(props.coreInfo);
    }

    this.setState({
      artPiecesImageShown: newArtPiecesImageShown,
    })
  }  

  pushToCurrentlyShownWorks(props){
    let currCurrentShownWorks = this.state.currentShownWorks.filter(shownWork => shownWork.id != props.id);
    currCurrentShownWorks.push(props);

    this.setState({
      currentShownWorks: currCurrentShownWorks
    })

  }

  removeFromCurrentlyShownWorks(props){
    let currCurrentShownWorks = this.state.currentShownWorks.filter(shownWork => shownWork.id != props.id);

    this.setState({
      currentShownWorks: currCurrentShownWorks
    })
  }

  getCurrentlyShownWorks(){
    let shown = [];
    this.state.currentShownWorks.forEach(shownWork => {
      shown.push(
        <p class="fact-times">
          {`(${shownWork.id}) ${shownWork.name}, ${shownWork.title}, 2023.`}
        </p>
      );
    });

    return(
      shown
    );
  }

  startDragElement(props) {
    let e = window.event;
    //console.log("MOUSE DOWN 2");
      
    const imgElement = document.getElementById(`${props.coreInfo.id}Img`);

    let newArtPiecesImageMoved = this.state.artPiecesImageMoved;
    let newArtPiecesImageMoving = this.state.artPiecesImageMoving;
    //let newArtPiecesImageShown = this.state.artPiecesimageShown;

    let newArtPiecesOffsetX = this.state.artPiecesOffsetX;
    let newArtPiecesOffsetY = this.state.artPiecesOffsetY;

    let newArtPiecesCurrX = this.state.artPiecesCurrX;
    let newArtPiecesCurrY = this.state.artPiecesCurrY;

    newArtPiecesImageMoved[props.coreInfo.id] = true;
    newArtPiecesImageMoving[props.coreInfo.id] = true;

    newArtPiecesOffsetX[props.coreInfo.id] = props.offsetX;
    //newArtPiecesOffsetX[props.coreInfo.id] = e.clientX - textRect.left;
    newArtPiecesOffsetY[props.coreInfo.id] = props.offsetY;
    //newArtPiecesOffsetY[props.coreInfo.id] = e.clientY - textRect.top;

    newArtPiecesCurrX[props.coreInfo.id] = props.currX;
    newArtPiecesCurrY[props.coreInfo.id] = props.currY;

    this.setState({
      artPiecesImageMoved: newArtPiecesImageMoved,
      artPiecesImageMoving: newArtPiecesImageMoving,
      artPiecesOffsetX: newArtPiecesOffsetX,
      artPiecesOffsetY: newArtPiecesOffsetY,
      artPiecesCurrX: newArtPiecesCurrX,
      artPiecesCurrY: newArtPiecesCurrY,
    })

    this.pushToCurrentlyShownWorks(props.coreInfo);
    this.continueDragElement(props);
  }

  stopDragElement(props) {
    let newArtPiecesImageMoving = this.state.artPiecesImageMoving;
    newArtPiecesImageMoving[props.coreInfo.id] = false;
    //console.log("MOUSE DOWN 3");
    this.setState({
      artPicesImageMoving: newArtPiecesImageMoving
    })
  }

  continueDragElement(props) {

    //shouldnt need the statement since it'll only come through from child component if its ok to do so
    //if(this.props.imageMoving){
      //let e = window.event;      
      //console.log(`MOUSE DOWN 2 APP.JS ${props.currX} - ${props.currY}`);
      //console.log(props);

      //const textElement = document.getElementById(`${props.coreInfo.id}Img`);
      //let textRect = textElement.getBoundingClientRect();

      //let newX = e.clientX - this.state.artPiecesOffsetX[props.coreInfo.id];
      //let newY = e.clientY - this.state.artPiecesOffsetY[props.coreInfo.id];

      let newArtPiecesCurrX = this.state.artPiecesCurrX;
      newArtPiecesCurrX[props.coreInfo.id] = props.currX;
      //newArtPiecesCurrX[props.coreInfo.id] = this.props.currX;

      let newArtPiecesCurrY = this.state.artPiecesCurrY;
      newArtPiecesCurrY[props.coreInfo.id] = props.currY;
      //newArtPiecesCurrY[props.coreInfo.id] = this.props.currX;

      this.setState({
        artPiecesCurrX: newArtPiecesCurrX,
        artPiecesCurrY: newArtPiecesCurrY
      })

      //console.log("MOUSE DOWN 2 APP.JS COMPARE");
      //console.log(this.state);
    //}else{
    //  console.log("MOUSE DOWN NOOOOT 2 APP.JS");
    //}
  }

  async getFunFact(number){
    if(number == this.state.mouseXWas || number == this.state.mouseYWas){
      return;
    }
    const resp = await fetch(`http://numbersapi.com/${number}/year`)
    .then(response => response.text())
    .then(data => {
      //console.log(response.text());
      this.setState({
        mathFact: [data, this.state.mathFact[0], this.state.mathFact[1], this.state.mathFact[2]],
        lastFactX: !this.state.lastFactX,
        mouseXWas: this.state.mouseX,
        mouseYWas: this.state.mouseY,
      });
    })
  }

  testHover(props){

    return; //temp disable
    let threshold = 1; //if difference > threshold, we will modify state
    let e = window.event;

    let posX = e.clientX;
    let posY = e.clientY;

    const textElement = document.getElementById(props.id);
    let textRect = textElement.getBoundingClientRect();
    //console.log(textRect.top, textRect.right, textRect.bottom, textRect.left); //mostly interested in top/left

    let minNormX = textRect.right - textRect.left;
    let cursorNormX = posX - textRect.left;

    let minNormY = textRect.bottom - textRect.top;
    let cursorNormY = posY - textRect.top;

    //console.log(`mouse pos: ${posX} - ${posY}, that means width=${(cursorNormX / minNormX) * 100}%, height=${(cursorNormY / minNormY) * 100}%`);
    //console.log("inner APP hover works: " + JSON.stringify(props));

    let finalCalcX = (cursorNormX / minNormX) * 100;
    let finalCalcY = (cursorNormY / minNormY) * 100;

//was trying to improve performance, defo makes the hover effect look worse, didnt do much to the other elements. 
    ////console.log(`hover test: ${Math.abs(finalCalcX - this.state.mouseRelativeXPercent)} - ${Math.abs(finalCalcY - this.state.mouseRelativeYPercent)}`)

    //if(Math.abs(finalCalcX - this.state.mouseRelativeXPercent) > threshold || Math.abs(finalCalcY - this.state.mouseRelativeYPercent) > threshold){
      this.setState({
        currHoverImg: props.img, 
        mouseRelativeXPercent: finalCalcX,
        mouseRelativeYPercent: finalCalcY
      });
    //}

  }

  clearHover(props){
    return; //temp disable
    //console.log("inner APP hover works: " + JSON.stringify(props));
    this.setState({currHoverImg: null});
  }

  applyIndexFilter(pressedFilter){
    var newIndexFilter = this.state.indexFilter;
    newIndexFilter[pressedFilter] = !newIndexFilter[pressedFilter];
    this.setState({
      indexFilter: newIndexFilter
    });

    //console.log("STATE: "  + JSON.stringify(this.state));
    /*
    console.log("PRESSED: " + pressedFilter);
    if(this.state.indexFilter.includes(pressedFilter)){
      this.state.indexFilter = this.state.indexFilter.remo
    }*/
  }

  getListOfWorks(){
    let classHTML = [];
    let currLetter = null;
    let pos = 0;

    //console.log("GET LIST OF WORKS");
    ClassJSON.students.forEach(student => {
      if((student.name.toUpperCase().includes(this.state.textFilter.toUpperCase()) && student.name.toUpperCase() != "SYS")
          || (student.name.toUpperCase() == "SYS" && this.state.artPiecesIsVisible[pos])){
        
        //console.log("student: " + JSON.stringify(student));
        //console.log("student COND: " + JSON.stringify(student));
        if(currLetter != student.name[0]){
          if(currLetter != null){
            classHTML.push(<br/>);
          }
          currLetter = student.name[0];
          classHTML.push(<div key={currLetter}>{currLetter}</div>);
        }

        //let newImageShown = this.state.artPiecesImageShown[student.id];

        //imageShown={this.state.artPiecesImageShown[student.id]}
        classHTML.push(<ArtPiece 
          key={currLetter + pos}

          isRandomImage={student.name == "sys"} 

          hoverOverTextFunc={this.testHover} 
          hoverExitTextFunc={this.clearHover} 
          continueDragElement={this.continueDragElement}
          stopDragElement={this.stopDragElement}
          startDragElement={this.startDragElement}
          clickText={this.clickText}

          incrementZIndex={this.incrementZIndex}

          coreInfo={student}
          currFilter={this.state.indexFilter}

          currX={this.state.artPiecesCurrX[pos]}
          currY={this.state.artPiecesCurrY[pos]}
          offsetX={this.state.artPiecesOffsetX[pos]}
          offsetY={this.state.artPiecesOffsetY[pos]}
          imageShown={this.state.artPiecesImageShown[pos]}
          imageMoved={this.state.artPiecesImageMoved[pos]}
          imageMoving={this.state.artPiecesImageMoving[pos]}
          currzIndex={this.state.artPiecesCuzzZIndex[pos]}

          gridSnap={this.state.gridSnap}
          />);
      }

      pos++;
    });

    return(
      classHTML
    );
  }

  updateTextFilter(newText){
    console.log("newtext: " + newText);
    this.setState({
      textFilter: newText
    });
  }

  getPage(){
    if(this.scrollbarRef != null){
      switch(this.scrollbarRef.current){
        case 0:
          return(
            <div>
              <div className="content" >
                <div className="left" >
                  <div className="title-container">
                    <span className="header">PRESS</span>
                    <br/><br/>
                    <a className="header">Print Screen</a>
                    <br/><br/>
                    <input className="search-bar" placeholder="Search..." onChange={e => this.updateTextFilter(e.target.value)}>
                    </input>
                  </div>
                  <div className="student-names"> 
                    {this.getListOfWorks()}
                  </div>
                </div>
                
                <div className="right">
                  <div>Filters</div>
                  <br/>
                  <a className="filter digital" 
                  onClick = {(() => this.applyIndexFilter("digital"))}
                  style={{color: this.state.indexFilter["digital"] ? "#840032" : "black"}}>
                    Digital
                  </a>

                  <a className="filter identity" 
                  onClick = {(() => this.applyIndexFilter("identity"))}
                  style={{color: this.state.indexFilter["identity"] ? "#E59500" : "black"}}>
                    Identity
                  </a>

                  <a className="filter logo" 
                  onClick = {(() => this.applyIndexFilter("logo"))}
                  style={{color: this.state.indexFilter["logo"] ? "#002642" : "black"}}>
                    Logo
                  </a>

                  <a className="filter print" 
                  onClick = {(() => this.applyIndexFilter("print"))}
                  style={{color: this.state.indexFilter["print"] ? "#04A777" : "black"}}>
                    Print
                  </a>

                  <a className="filter poster" 
                  onClick = {(() => this.applyIndexFilter("poster"))}
                  style={{color: this.state.indexFilter["poster"] ? "#5398BE" : "black"}}>
                    Poster
                  </a>

                  <a className="filter layout" 
                  onClick = {(() => this.applyIndexFilter("layout"))}
                  style={{color: this.state.indexFilter["layout"] ? "#D4E79E" : "black"}}>
                    Layout
                  </a>

                  <a className="filter web" 
                  onClick = {(() => this.applyIndexFilter("web"))}
                  style={{color: this.state.indexFilter["web"] ? "#EEFC57" : "black"}}>
                    Web
                  </a>

                </div>
              </div>
            </div>
          );
        case 3:
          return(
            <div className="index-main"> 
              <ThreeJS/> 
              <HelpText/>
            </div>
          );
      }
    }

    return(
      <div>uh oh ewwow : ( </div>
    );
  }

  generatePDFHTML(){
    return(
      `<div>1111111111111111<div>
      <img src="%img1%" width="150" height="150"/>
      <div>2222222222222<div>
      `
    );
  }

  pdfTestSave(){
    console.log("test save start");
    
    var pdfHTML = `${this.generatePDFHTML()}`;
    var formData = new FormData();

    formData.append("msg", "deez nuts");
    formData.append("pdf", "na");
    //formData.append("img1Path", imgOne);
    //formData.append("pdf", pdfResponse);
    formData.append("pdfHTML", pdfHTML);
    formData.append("pdfName", `${Math.random() * 10000000} - ${Date.now()}.pdf`);

    /*
    console.log("FORM DATA: ");
    for (const [key, value] of formData) {
      console.log(`   ${key}: ${value}`);
    }*/
    
    axios({
      url: "http://localhost:8000/index.php", 
      method: "POST",
      data: formData,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
    }
    })
    .then(function(response) {
        console.log("outcome 1");
        console.log(response);          
    })
    .then(function(myJson) {
        // use parseed result
        console.log("outcome 2");
        console.log(myJson);
    });

    console.log("test save end");
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
        
        <div className="index-main-BG" style={backgroundStyle}></div>
        <div className="index-main-paper" style={{backgroundImage: `url(${this.paperTextures[0]})`, visibility:`${this.state.currPaperTexture == 0 ? "visible" : "hidden"}`}}></div>
        <div className="index-main-paper" style={{backgroundImage: `url(${this.paperTextures[1]})`, visibility:`${this.state.currPaperTexture == 1 ? "visible" : "hidden"}`}}></div>
        <div className="index-main-paper" style={{backgroundImage: `url(${this.paperTextures[2]})`, visibility:`${this.state.currPaperTexture == 2 ? "visible" : "hidden"}`}}></div>
        <div className="index-main-paper" style={{backgroundImage: `url(${this.paperTextures[3]})`, visibility:`${this.state.currPaperTexture == 3 ? "visible" : "hidden"}`}}></div>
        <div className="index-main-paper" style={{backgroundImage: `url(${this.paperTextures[4]})`, visibility:`${this.state.currPaperTexture == 4 ? "visible" : "hidden"}`}}></div>
        
        <div className="bottom-of-page">
          <div>
            <p className="fact-times">{this.state.mouseX}, {this.state.mouseY}</p>
            {this.getCurrentlyShownWorks()}
          </div>
          <ScrollingBanner clickFunc = {this.scrollbarRef}/>

          <div className="scrolling-banner-child" onClick = {(() => this.pdfTestSave())}>
          Default2
          </div>

        </div>
        <div>
            {this.getPage()}
        </div>
      </div>
    );
  }
}

export default App;

/*
          <div>
            <p className="fact-times">{this.state.mouseX}, {this.state.mouseY}</p>
            <p className="fact-times" style={{visibility:`${this.state.mathFact[0] == null ? "hidden" : "visible"}`}}>{this.state.mathFact[0]}</p>
            <p className="fact-times" style={{visibility:`${this.state.mathFact[1] == null ? "hidden" : "visible"}`}}>{this.state.mathFact[1]}</p>
            <p className="fact-times" style={{visibility:`${this.state.mathFact[2] == null ? "hidden" : "visible"}`}}>{this.state.mathFact[2]}</p>
            <p className="fact-times" style={{visibility:`${this.state.mathFact[3] == null ? "hidden" : "visible"}`}}>{this.state.mathFact[3]}</p>
          </div>
          */
