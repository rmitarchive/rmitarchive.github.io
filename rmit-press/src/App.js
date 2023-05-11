import './App.css';
import baseHoverImg from "./Img/icon.png";
import mask from "./Img/SquareMask.png";
import ArtPiece from "./ArtPiece";
import HelpText from "./HelpText";
import ScrollingBanner from "./ScrollingBanner";
import ThreeJS from "./ThreeJS";
import React from 'react';

import ClassJSON from "./Data/class.json"

/* import paperText1 from "./Img/test-paper-texture.png";
import paperText2 from "./Img/test-paper-texture-2.png";
import paperText3 from "./Img/test-paper-texture-3.png";
import paperText4 from "./Img/test-paper-texture-4.png";
import paperText5 from "./Img/test-paper-texture-5.png"; */

import axios from 'axios';
//import { Page, Text, View, Document, StyleSheet, ReactPDF } from '@react-pdf/renderer';
//https://medium.com/craftcode-design/how-to-build-a-contact-form-with-react-js-and-php-d5977c17fec0
//<marquee behavior="alternate">Test test test</marquee>
class App extends React.Component {
  constructor(props){
    super(props);

    /* this.paperTextures = [paperText1, paperText2, paperText3, paperText4, paperText5]; */
    
    this.testHover = this.testHover.bind(this); //currently empty funcs, since we arent doing that any more
    this.clearHover = this.clearHover.bind(this); //currently empty funcs, since we arent doing that any more

    this.startDragElement = this.startDragElement.bind(this);
    this.stopDragElement = this.stopDragElement.bind(this);
    this.continueDragElement = this.continueDragElement.bind(this);
    this.clickText = this.clickText.bind(this);
    
    this.incrementZIndex = this.incrementZIndex.bind(this);

    this.openFocusArtPiece = this.openFocusArtPiece.bind(this);

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
      gridSnap: false,    

      currentShownWorks: currentShownWorks,
      focusArtPiece: null
    }    

    /*
    setInterval(() => {
      this.getFunFact(this.state.lastFactX ? this.state.mouseX : this.state.mouseY);
    }, 500);
*/
    window.addEventListener('click', (event) => {
      //return //temp disable its annoying lol
      if(Math.random() < .05){ //reduced rate pretty significantly.
        /*was happening too often imo */
        this.showRandomImage();
      }
    });

    /* setInterval(() => {
      let newCurrPaperTexture = Math.floor(Math.random() * this.paperTextures.length);
      //console.log("newCurrPaperTexture: " + newCurrPaperTexture);
      this.setState((prevState) => {
        return{
          //currPaperTexture: (this.state.currPaperTexture + 1) % this.paperTextures.length
          currPaperTexture: newCurrPaperTexture
        };
      });
    }, 250);   */ 
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
      this.pushToCurrentlyShownWorks(ClassJSON.students[pot[randIndex]]);
  
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

  clickText(props, newImageShown, isForcedPush) {
    let newArtPiecesImageShown = this.state.artPiecesImageShown;
    newArtPiecesImageShown[props.id] = newImageShown;

    //console.log(`click hit: ${newArtPiecesImageShown[props.id]} isForcedPush: ${isForcedPush}`);
    if(!newArtPiecesImageShown[props.id]){
      //console.log("remove from");
      this.removeFromCurrentlyShownWorks(props);
    }else if(this.state.artPiecesImageMoved[props.id]){
      //console.log("show");
      this.pushToCurrentlyShownWorks(props.coreInfo);
    }

    if(isForcedPush){
      //console.log("show (forced)");
      this.pushToCurrentlyShownWorks(props.coreInfo);
    }

    console.log(`newArtPiecesImageShown: ${newArtPiecesImageShown}`);

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

    console.log("pre: " + JSON.stringify(this.state.currentShownWorks));
    console.log("post: " + JSON.stringify(currCurrentShownWorks));

    this.setState({
      currentShownWorks: currCurrentShownWorks
    });
  }
  
  getCurrentlyShownWorks(){
    let shown = [];
    this.state.currentShownWorks.forEach(shownWork => {
      /* i made a thing work! */
      let i = 0
      if (shown.length==0){
        shown.push(<div key={"indextitle"} className="fact-times"><br></br>Index</div>);
      }

      if (shownWork.name == "sys") {
        shown.push(
          <p className="fact-times" key={shownWork.id + "CSW"}>
            {`(Fig. ${shownWork.id}) ${shownWork.title}`}
          </p>
        );
      } else {
        shown.push(
          <p className="fact-times" 
          key={shownWork.id + "CSW"}
          style={{cursor: "pointer"}}
          onMouseDown={() => this.openFocusArtPiece(shownWork)}
          >
            {`(${shownWork.id}) ${shownWork.name}, ${shownWork.title} (2023)`}
          </p>
        )
      };
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

    let newArtPiecesImageShown = this.state.artPiecesImageShown;
    //let newArtPiecesImageShown = this.state.artPiecesimageShown;

    let newArtPiecesOffsetX = this.state.artPiecesOffsetX;
    let newArtPiecesOffsetY = this.state.artPiecesOffsetY;

    let newArtPiecesCurrX = this.state.artPiecesCurrX;
    let newArtPiecesCurrY = this.state.artPiecesCurrY;

    newArtPiecesImageMoved[props.coreInfo.id] = true;
    newArtPiecesImageMoving[props.coreInfo.id] = true;

    newArtPiecesImageShown[props.coreInfo.id] = true;

    newArtPiecesOffsetX[props.coreInfo.id] = props.offsetX;
    //newArtPiecesOffsetX[props.coreInfo.id] = e.clientX - textRect.left;
    newArtPiecesOffsetY[props.coreInfo.id] = props.offsetY;
    //newArtPiecesOffsetY[props.coreInfo.id] = e.clientY - textRect.top;

    newArtPiecesCurrX[props.coreInfo.id] = props.currX;
    newArtPiecesCurrY[props.coreInfo.id] = props.currY;

    this.setState({
      artPiecesImageMoved: newArtPiecesImageMoved,
      artPiecesImageMoving: newArtPiecesImageMoving,
      artPiecesImageShown: newArtPiecesImageShown,
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
    //  //console.log("MOUSE DOWN NOOOOT 2 APP.JS");
    //}
  }

  async getFunFact(number){
    return; //temp disable
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
    //console.log("PRESSED: " + pressedFilter);
    if(this.state.indexFilter.includes(pressedFilter)){
      this.state.indexFilter = this.state.indexFilter.remo
    }*/
  }

  getListOfWorks(){
    let classHTML = [];
    let currLetter = null;
    let pos = 0;

    //console.log(`${this.state.artPiecesImageShown}`);

    //console.log("GET LIST OF WORKS");
    ClassJSON.students.forEach(student => {
      if((student.name.toUpperCase().includes(this.state.textFilter.toUpperCase()) && student.name.toUpperCase() != "SYS")
          || (student.name.toUpperCase() == "SYS" && this.state.artPiecesIsVisible[pos])){
        
        //console.log("student: " + JSON.stringify(student));
        //console.log("student COND: " + JSON.stringify(student));
        if(currLetter != student.name[0]){
          if(currLetter != null){
            classHTML.push(<br key={pos + "BR"}/>);
          }
          currLetter = student.name[0];
          classHTML.push(<div key={pos + currLetter}>{currLetter}</div>);
        }

        classHTML.push(<ArtPiece 
          key={pos + "APP"}

          isRandomImage={student.name == "sys"} 

          hoverOverTextFunc={this.testHover} 
          hoverExitTextFunc={this.clearHover} 
          continueDragElement={this.continueDragElement}
          stopDragElement={this.stopDragElement}
          startDragElement={this.startDragElement}
          clickText={this.clickText}

          incrementZIndex={this.incrementZIndex}

          openFocusArtPiece={this.openFocusArtPiece}

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
    //console.log("newtext: " + newText);
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
                    <input className="search-bar" placeholder="Search..." onChange={e => this.updateTextFilter(e.target.value)}>
                    </input>
                  </div>
                  <div className="student-names"> 
                  
                  <div>Filters</div>
                  <br/>
                  <a className="filter digital" 
                  onClick = {(() => this.applyIndexFilter("digital"))}
                  style={{backgroundColor: this.state.indexFilter["digital"] ? "#0078BF" : "transparent"}}>
                    Digital
                  </a>
                  <br></br>
                  <a className="filter identity" 
                  onClick = {(() => this.applyIndexFilter("identity"))}
                  style={{backgroundColor: this.state.indexFilter["identity"] ? "#ff48b0" : "transparent"}}>
                    Identity
                  </a>
                  <br></br>
                  <a className="filter logo" 
                  onClick = {(() => this.applyIndexFilter("logo"))}
                  style={{backgroundColor: this.state.indexFilter["logo"] ? "#F15060" : "transparent"}}>
                    Logo
                  </a>
                  <br></br>
                  <a className="filter print" 
                  onClick = {(() => this.applyIndexFilter("print"))}
                  style={{backgroundColor: this.state.indexFilter["print"] ? "#00A95C" : "transparent"}}>
                    Print
                  </a>
                  <br></br>
                  <a className="filter poster" 
                  onClick = {(() => this.applyIndexFilter("poster"))}
                  style={{backgroundColor: this.state.indexFilter["poster"] ? "#FF6C2f" : "transparent"}}>
                    Poster
                  </a>
                  <br></br>
                  <a className="filter layout" 
                  onClick = {(() => this.applyIndexFilter("layout"))}
                  style={{backgroundColor: this.state.indexFilter["layout"] ? "#00838A" : "transparent"}}>
                    Layout
                  </a>
                  <br></br>
                  <a className="filter web" 
                  onClick = {(() => this.applyIndexFilter("web"))}
                  style={{backgroundColor: this.state.indexFilter["web"] ? "#FFE800" : "transparent"}}>
                    Web
                  </a>
                  <br></br><br></br><br></br><br></br>
                    {this.getListOfWorks()}
                  </div>
                </div>
                
                <div className="right">
                <a className="header" onClick = {(() => this.pdfTestSave())}>Print Screen</a>
                    
                <a className="header" onClick = {(() => this.clearPage())}>Clear Screen</a>

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

  generatePDFHTML(props){
    let returnHTML = [];

    returnHTML.push(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <link rel="stylesheet" type="text/css" media="all" href="pdf-styles.css">
      </head>
      <body>`);


    returnHTML.push(`<div class="content">`);
      for(let i = 0; i < this.state.currentShownWorks.length; i++){
      //for(let i = 0; i < this.state.artPiecesImageShown.length; i++){
        //if(this.state.artPiecesImageShown[i] == true){
          let currID = this.state.currentShownWorks[i].id;
        returnHTML.push(`<div style="position: absolute; left: ${this.state.artPiecesCurrX[currID]}px; top: ${this.state.artPiecesCurrY[currID]}px; z-index: ${i};">
          <img style="max-width: 15em;" src="%img${i}%">
          (${currID})
          </div>`
          );
        //}
      }
      
    returnHTML.push(`</div>`);

    returnHTML.push(`<div class="bottom-of-page">
      <div>
        <div class="fact-times"><br>Index</div>
        <p class="fact-times" style="cursor: pointer;">(3) Brooke Davis, Untitled (2023)</p>//change to variable
      </div>
    </div>`); 


    returnHTML.push(`</body>
    </html>`);

    return(
      returnHTML
    );
  }

  clearPage(){
    //console.log("clear page");
    let newArtPiecesImageShown = this.state.artPiecesImageShown;
    

    for(let i = 0; i < newArtPiecesImageShown.length; i++){
      //console.log(i);
      newArtPiecesImageShown[i] = false;
      const toHide = document.getElementById(i+"DD");



      if(toHide != null){
        //console.log("   IS NOT NULL");
        //console.log(`to hide: ${i}`);
        //this.removeFromCurrentlyShownWorks(ClassJSON.students[i]);
        toHide.style.display = "none";
        toHide.style.color = "red";
      }else{
        //console.log("   IS NULL");
      }
    }

    this.setState({
      artPiecesImageShown: newArtPiecesImageShown,
      currentShownWorks: []
    })
  }

  pdfTestSave(){
    console.log("test save start");
    
    var pdfHTML = `${this.generatePDFHTML()}`;
    var formData = new FormData();

    formData.append("msg", "deez nuts");
    formData.append("pdf", "na");

    const textElement = document.getElementById(`root`);
    let textRect = textElement.getBoundingClientRect();

    formData.append("width", textRect.right);
    formData.append("height", textRect.bottom);
    //formData.append("img1Path", imgOne);
    //formData.append("pdf", pdfResponse);
    formData.append("pdfHTML", pdfHTML);
    formData.append("pdfName", `${Math.random() * 10000000} - ${Date.now()}.pdf`);
    
    for(let i = 0; i < this.state.currentShownWorks.length; i++){
      formData.append("imgPaths[]", this.state.currentShownWorks[i].image);
      console.log("CURR IMG: ");
      console.log(this.state.currentShownWorks[i]);
    }

    axios({
      url: "http://localhost:8000/index.php", 
      //url: "http://shwag.com.au/php/index.php", 
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

  openFocusArtPiece(props){
    console.log(`openFocusArtPiece: ${JSON.stringify(props)}`);

    if(this.state.focusArtPiece != null && props.id == this.state.focusArtPiece.id){
      this.setState({
        focusArtPiece: null
      });
    }else{
      this.setState({
        focusArtPiece: props
      });
    }
  }

  removeFocusArtPiece(){
    this.setState({
      focusArtPiece: null
    });
  }

  getFocusArtPiece(){
    if (this.state.focusArtPiece == null) {
      return (<div style={{ visibility: "hidden" }}></div>);
    }

    return (
        <div className="focus-BG">
          <div className = "focus-Header">{`(${this.state.focusArtPiece.id}) ${this.state.focusArtPiece.name}, ${this.state.focusArtPiece.title} (2023)`}</div>
          <a className = "focus-Close" onMouseDown={() => this.removeFocusArtPiece()}> Close </a>
          <img className="focus-Img"
            src={require(`./Img/${this.state.focusArtPiece.image}`)}
            />
            <p className="focus-Desc">{this.state.focusArtPiece.desc}</p>
        </div>
    );
  }

  render() {

    //console.log("currentShownWorks: " + this.state.currentShownWorks);
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
        <div className="bottom-of-page">
        <ScrollingBanner clickFunc = {this.scrollbarRef}/> 
          <div>
            <p className="fact-times">{this.state.mouseX}, {this.state.mouseY}</p>
            {this.getCurrentlyShownWorks()}
          </div>
        </div>
        <div>
            {this.getPage()}
            {this.getFocusArtPiece()}
        </div>
      </div>
    );
  }
}

export default App;