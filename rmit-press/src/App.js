import './App.css';
import baseHoverImg from "./Img/icon.png";
import mask from "./Img/SquareMask.png";
import ArtPiece from "./ArtPiece";
import HelpText from "./HelpText";
import ScrollingBanner from "./ScrollingBanner";
import ThreeJS from "./ThreeJS";
import React from 'react';

import ClassJSON from "./Data/class.json"
import {BrowserView, MobileView, isMobile} from 'react-device-detect';
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

    var artPiecescurrZIndex = [];

    var artPiecesIsVisible = [];
    var currentShownWorks = [];

    ClassJSON.students.forEach(student => {
      artPiecesOffsetX.push(0);
      artPiecesOffsetY.push(0);
      artPiecesCurrX.push(0);
      artPiecesCurrY.push(0);
      artPiecescurrZIndex.push(12);

      artPiecesImageShown.push(false);
      artPiecesImageMoved.push(false);
      artPiecesImageMoving.push(false);
      artPiecesIsVisible.push(student.name != "sys");
    });

    if(path.toUpperCase().includes("PRINT")){
      this.scrollbarRef.current = 3;
    }else if(path.toUpperCase().includes("HELP")){
      this.scrollbarRef.current = 2;
    }else if(path.toUpperCase().includes("ABOUT")){
      this.scrollbarRef.current = 1;
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

      artPiecescurrZIndex: artPiecescurrZIndex,
      artPiecesSpawned: artPiecescurrZIndex,

      artPiecesIsVisible: artPiecesIsVisible,

      baseZIndex: 12,
      gridSnap: false,    

      currentShownWorks: currentShownWorks,
      focusArtPiece: null,
      isAcknowledged: false,
      mobileShowMenu: false,
      isLoaded: false,

      printResponse: null,
      printerEmail: null,
      userEmail: null,
      emailSent: false,
      printStarted: false,
    }    

    //document.documentElement.style.setProperty('--menuZIndex', isMobile ? 9999999 : 10);

    if(isMobile){
      document.documentElement.style.setProperty('--menuZIndex', 9999999);
      document.documentElement.style.setProperty('--leftWidth', "100%");
      document.documentElement.style.setProperty('--rightWidth', "30vw");
      document.documentElement.style.setProperty('--aboutWidth', "100vw");
      document.documentElement.style.setProperty('--mobileMenuDisplay', "none");
      document.documentElement.style.setProperty('--ackFont', "1em");
      document.documentElement.style.setProperty('--printWidth', "99vw");

    }

    window.addEventListener('click', (event) => {
      //return //temp disable its annoying lol
      if(Math.random() < .05){ //reduced rate pretty significantly.
        /*was happening too often imo */
        this.showRandomImage();
      }
    });
  }

  componentDidMount(){
    document.title = "P-R-E-S-S";
    this.setState({
      isLoaded:true
    });
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

      let newArtPiecescurrZIndex = this.state.artPiecescurrZIndex;
      newArtPiecescurrZIndex[pot[randIndex]] = this.incrementZIndex();
  
      const textElement = document.getElementById(`root`);
      let textRect = textElement.getBoundingClientRect();
  
      let newArtPiecesCurrX = this.state.artPiecesCurrX;
      let width = textRect.right;
  
      let newArtPiecesCurrY = this.state.artPiecesCurrY;
      let height = textRect.bottom;

      if(isMobile){
        newArtPiecesCurrX[pot[randIndex]] = (Math.random() * (width * .5));
        newArtPiecesCurrY[pot[randIndex]] = (Math.random() * (height * .6));
      }else{
        newArtPiecesCurrX[pot[randIndex]] = (Math.random() * (width * .4)) + (width * .1);
        newArtPiecesCurrY[pot[randIndex]] = (Math.random() * (height * .4)) + (height * .1);
      }
      
      this.pushToCurrentlyShownWorks(ClassJSON.students[pot[randIndex]]);
  
      console.log(`SHOW RANDOM IMAGE ${pot[randIndex]} `);
      console.log(`SHOW RANDOM IMAGE/artPiecescurrZIndex:  ${newArtPiecescurrZIndex} `);
      console.log(`SHOW RANDOM IMAGE/artPiecescurrZIndex:  ${newArtPiecescurrZIndex} `);
      this.setState({
        artPiecesIsVisible: newArtPiecesIsVisible,
        artPiecesImageShown: newArtPiecesImageShown,
        artPiecesImageMoved: newArtPiecesImageMoved,
        artPiecesCurrX: newArtPiecesCurrX,
        artPiecesCurrY: newArtPiecesCurrY,

        artPiecescurrZIndex: newArtPiecescurrZIndex
      });
    }else{
      //console.log("NO IMAGES")
    }
  }


  incrementZIndex() {
    let newZIndex = this.state.baseZIndex + 1;
    console.log(`incrementZIndex: ${newZIndex}`);
    
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
            {
            isMobile ? `(${shownWork.id}) ${shownWork.name}`
            : `(${shownWork.id}) ${shownWork.name}, ${shownWork.title} (2023)` 
            }
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

    let newMobileShowMenu = !isMobile;

    this.setState({
      artPiecesImageMoved: newArtPiecesImageMoved,
      artPiecesImageMoving: newArtPiecesImageMoving,
      artPiecesImageShown: newArtPiecesImageShown,
      artPiecesOffsetX: newArtPiecesOffsetX,
      artPiecesOffsetY: newArtPiecesOffsetY,
      artPiecesCurrX: newArtPiecesCurrX,
      artPiecesCurrY: newArtPiecesCurrY,
      
      //mobileShowMenu: newMobileShowMenu
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

  //toggles respective filter item in dictionary
  applyIndexFilter(pressedFilter){
    var newIndexFilter = this.state.indexFilter;
    newIndexFilter[pressedFilter] = !newIndexFilter[pressedFilter];
    this.setState({
      indexFilter: newIndexFilter
    });
  }

  //PSEUDO:
  //clearAllFilters Func
  //create new dictionary, based off indexFilter (dictionaries are similar to JSON, key value pair)
    //set all values to false
      //May be able to use either forEach, or the map() function to do this.
      //otherwise just hardcode it, dicts work like JSON, so you can modify the value by accessing via the key
        //newIndexFilter["x"] = y;
  //setstate 
    //Note: applyIndexFilter may give some good hints.

    clearAllFilters(){
      var newIndexFilter = this.state.indexFilter;
      
      newIndexFilter["digital"] = false;
      newIndexFilter["identity"] = false;
      newIndexFilter["logo"] = false;
      newIndexFilter["print"] = false;
      newIndexFilter["poster"] = false;
      newIndexFilter["layout"] = false;
      newIndexFilter["web"] = false;

      this.setState({
        indexFilter: newIndexFilter
      });
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
        if(currLetter != student.name[0] && student.name[0] != "s"){
          if(currLetter != null){
            classHTML.push(<br key={pos + "BR"}/>);
          }
          currLetter = student.name[0];
          classHTML.push(<div className="student" key={pos + currLetter}>{currLetter}</div>);
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
          currZIndex={this.state.artPiecescurrZIndex[pos]}

          gridSnap={this.state.gridSnap} 

          isMobile={isMobile}
          showText={this.state.mobileShowMenu}
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
          this.resetPrint();
          return(
            <div>
              <div className="content" >
                <MobileView>
                  <div className="mobile-menu-background"> </div>
                </MobileView>
                <div className="left" >
                  <div className="title-container">
                    <span className="header">PRESS</span>
                    <br/><br/>
                    <MobileView>
                    <input className="search-bar" 
                    placeholder="Search..." 
                    style={{visibility: this.state.mobileShowMenu ? "inherit" : "hidden"}} 
                    onChange={e => this.updateTextFilter(e.target.value)}>
                    </input>
                    </MobileView>
                    <BrowserView>
                    <input className="search-bar" 
                    placeholder="Search..." 
                    onChange={e => this.updateTextFilter(e.target.value)}>
                    </input>
                    </BrowserView>
                  </div>
                  <div className="student-names"> 
                  <div className="menu-to-hide" >
                    <div>Filters</div>
                    <br/>
                    <div>
                      <a className="student"  
                      onClick = {(() => this.applyIndexFilter("digital"))}
                      style={{backgroundColor: this.state.indexFilter["digital"] ? "#0078BF" : "transparent"}}>
                        Digital
                      </a>
                    </div>
                    <div>
                    <a className="student" 
                    onClick = {(() => this.applyIndexFilter("identity"))}
                    style={{backgroundColor: this.state.indexFilter["identity"] ? "#ff48b0" : "transparent"}}>
                      Identity
                    </a>
                    </div>
                    <div>
                    <a className="student" 
                    onClick = {(() => this.applyIndexFilter("logo"))}
                    style={{backgroundColor: this.state.indexFilter["logo"] ? "#F15060" : "transparent"}}>
                      Logo
                    </a>
                    </div>
                    <div>
                    <a className="student" 
                    onClick = {(() => this.applyIndexFilter("print"))}
                    style={{backgroundColor: this.state.indexFilter["print"] ? "#00A95C" : "transparent"}}>
                      Print
                    </a>
                    </div>
                    <div>
                    <a className="student" 
                    onClick = {(() => this.applyIndexFilter("poster"))}
                    style={{backgroundColor: this.state.indexFilter["poster"] ? "#FF6C2f" : "transparent"}}>
                      Poster
                    </a>
                    </div>
                    <div>
                    <a className="student" 
                    onClick = {(() => this.applyIndexFilter("layout"))}
                    style={{backgroundColor: this.state.indexFilter["layout"] ? "#00838A" : "transparent"}}>
                      Layout
                    </a>
                    </div>
                    <div>
                    <a className="student" 
                    onClick = {(() => this.applyIndexFilter("web"))}
                    style={{backgroundColor: this.state.indexFilter["web"] ? "#FFE800" : "transparent"}}>
                      Web
                    </a>
                    </div>
                    <br></br><br></br>
                    <a className="student" 
                    onClick = {(() => this.clearAllFilters())}>
                      Clear Filters
                    </a>
                  </div>
                  <br></br><br></br><br></br><br></br>
                    {this.getListOfWorks()}
                  </div>
                </div>
                <BrowserView>
                  <div className="right">
                    <a className="screen-func-header" onClick = {(() => this.startPDF())}>Print Screen</a>
                    <a className="screen-func-header" onClick = {(() => this.clearPage())}>Clear Screen</a>
                  </div> 
                </BrowserView>

              </div>
            </div>
          );
        case 1:
          this.resetPrint();
          return (
          <div className="about-container">
            <MobileView>
                  <div className="mobile-menu-background"> </div>
                </MobileView>
          <div className="about-title">PRESS<br></br>RMIT Graduate Showcase<br></br>15 June, 2023</div>
          <br></br>
          <div className="about-body">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus accumsan lacinia ullamcorper. Quisque facilisis purus vel pulvinar finibus. Donec pretium sollicitudin turpis vitae viverra. Nullam consequat euismod nisl, non lacinia ligula eleifend eget. Proin ornare nibh eu turpis ultricies, vitae aliquet mi consequat. Duis ante ipsum, bibendum sed lorem in, imperdiet viverra elit. Nulla et interdum sem, ut sodales tortor. Nam porta dui sed ligula dignissim varius. Fusce sollicitudin eros ut gravida facilisis. Curabitur varius mollis eros nec porttitor.
          <br></br><br></br>
          Maecenas id nisl viverra, feugiat dui nec, tincidunt arcu. Etiam vel augue in ipsum fermentum sagittis in id nisl. In eu orci nisi. Integer porta sed tellus sed gravida. Nulla facilisi. Duis at sem nec ante dapibus scelerisque ut id nisi. Praesent elementum libero ut nibh fringilla euismod. Pellentesque quis maximus dui, vel suscipit tortor.
          <br></br><br></br>
          Vestibulum arcu turpis, condimentum quis risus a, eleifend efficitur elit. Nunc tempus massa tellus, sit amet aliquet purus luctus in. Quisque venenatis nunc consectetur velit iaculis fringilla. Interdum et malesuada fames ac ante ipsum primis in faucibus. Aliquam id faucibus velit, ac dictum lacus. Fusce velit tortor, elementum in velit at, fringilla tincidunt dui. Cras imperdiet mauris eget dui eleifend, hendrerit facilisis tortor elementum. Ut rutrum.
          </div>
            <br></br>
            <dl>
              <dt className="about-title">PRESS Production Credits:</dt>
              <br/>
              <dt className="about-body">Ella Taylor</dt>
              <dd className="about-body">Layout, Identity</dd>
              <dt className="about-body">Liam Kenna</dt>
              <dd className="about-body">Front & Back End Website</dd>
              <dt className="about-body">Nicholas Gleeson</dt>
              <dd className="about-body">Layout, Identity</dd>
              <dt className="about-body">Timon Muery</dt>
              <dd className="about-body">Layout, Identity</dd>
              <dt className="about-body">Zachariah Micallef</dt>
              <dd className="about-body">Front End Website, Identity</dd>
            </dl>
            <br></br>
          <div className="about-body">
            This project would not have been possible without the gracious support of Suzie Zezula, Jiayu Cheng, and RMIT University.<br></br><br></br>
            All rights reserved, PRESS, 2023. <br></br><br></br>
            No part of this site may be reproduced without explicit permission from the copyright owner(s)
            <br></br><br></br><br></br><br></br><br></br><br></br>
            <br></br><br></br><br></br><br></br><br></br><br></br>
          </div>
        </div>);
        case 2:
          this.resetPrint();
          return(
            <div className="index-main"> 
              <MobileView>
                <div className="mobile-menu-background"> </div>
              </MobileView>
              <ThreeJS/> 
              <HelpText/>
            </div>
          );   
        case 3:   //print/reciept
          return(
            <div className="index-main"> 
              {this.getRecieptPage()}
            </div>
          );
      }


    }

    return(
      <div>404</div>
    );
  }

  resetPrint(){
    if(this.state.printStarted){
      this.setState({
        printResponse: null,
        printerEmail: null,
        userEmail: null,
        emailSent: false,
        printStarted: false,
      })
    }
  }

  returnToHome(){
    window.history.pushState("object or string", "Title", "/");
    this.scrollbarRef.current = 0;
  }

  getRecieptPage(){

    if(!this.state.printStarted){
      return(
        <div className="print-container">
          <div className="print-title">
            Print Screen
          </div>
          <MobileView>
          <a className="print-return" onTouchStart = {(() => this.returnToHome())}>
            Return Home
          </a>
          </MobileView>
          <BrowserView>
          <a className="print-return" onClick = {(() => this.returnToHome())}>
            Return Home
          </a>
          </BrowserView>
          <br/>
          <div className="print-body">
            By inputting your email below, you will receive a generative print created from the images you have selected and the positions in which you have arranged them in.
            <br/><br/>
            Attendees of the launch of PRESS (15 June 2023: Building 9, Level 1, Bowen Street) will receive a Risograph edition print of their file on the night. Once submitted, please approach the printing area with your proof of print receipt and the email you used to submit with.
          </div>
          <br/>
          <input className="search-bar" placeholder="Input Email..." onChange={e => this.setUserEmail(e.target.value)}/> 
          <br/>
          <br/>
          <a className="print-confirm" onClick = {(() => this.doPDFProcess())}>Continue</a>
          <br/>
          <br/>
          <div className="print-body">
            {this.state.printResponse != null ? this.state.printResponse : ""}
          </div>
          <div className="print-footer">
            All intellectual property of the imagery contained within the prints belongs to the original artists. Any reproduction or use of the imagery outside of the printed matter produced by PRINT is forbidden without explicit permission from the copyright owner(s). All rights reserved, PRESS, 2023.<br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
          </div>
        </div>
        );
    } else if(!this.state.emailSent){
      //loading screen
      return(<div className="print-container">
        <div className='print-loading-container'>
          <div className="print-loading-text">{/*Processing File ( ... )*/}</div>
        </div>
        <ThreeJS/> 
      </div>
      );
    }else{
      //receipt
      return(
        <div class="print-container">
          <div class="print-title">
            Confirmation
          </div>
          <MobileView>
          <a class="print-return" onTouchStart = {(() => this.returnToHome())}>
            Return Home
          </a>
          </MobileView>
          <BrowserView>
          <a class="print-return" onClick = {(() => this.returnToHome())}>
            Return Home
          </a>
          </BrowserView>
          <br/>
          <div class="print-body">
            The file has been processed and has been emailed to the account you inputted in the previous field. If you are unable to find the file, please check your spam folder.
            <br/><br/>
            Attendees of PRESS will not receive an email directly to their account. Please approach the printing area with the print receipt below, along with the email you inputted into the previous field.
          </div>
          <br/>
          <div class="print-title">
            <a>{`${this.state.printResponse}`}</a>
          </div>
          <div class="print-footer">
            All intellectual property of the imagery contained within the prints belongs to the original artists. Any reproduction or use of the imagery outside of the printed matter produced by PRINT is forbidden without explicit permission from the copyright owner(s). All rights reserved, PRESS, 2023.<br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br><br></br>
          </div>
        </div>        
      );
    }
  }
//validation can happen here.
  doPDFProcess(){
    let validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.userEmail))) {
      this.setState({printResponse: "EMAIL INVALID"});
      return;
    }
    /*
    //Q: should we prevent prints with no user works? Might just handle the php side for now.
    if (this.state.currentShownWorks == null || this.state.currentShownWorks.length == 0){
      this.setState({printResponse: "EMAIL INVALID"});
      return;
    }
    */
//can print
    this.generatePDF();
    this.setState({
      printResponse: null,
      printStarted: true
    });
  }

  //should really add email validation via regex
  setUserEmail(email){
    this.setState({userEmail: email});
  }

  generatePDFHTML(){
    let returnHTML = "";

    returnHTML += (`
      <!DOCTYPE html>
      <html lang="en">
      <head>
      <meta charset="UTF-8">
      <link rel="stylesheet" type="text/css" media="all" href="pdf-styles.css">
      </head>
      <body>`);


    returnHTML += (`<div class="content">`);  

    if(isMobile){
      returnHTML += (`<div class="content" style="transform: scale(1, -1); top: 700px; left:100px;">`);
      let modifier = 1.5;
      for(let i = 0; i < this.state.currentShownWorks.length; i++){
        let currID = this.state.currentShownWorks[i].id;
          /*const foundImg = document.getElementById(`${this.state.currentShownWorks[i].id}Img`);
          console.log(`foundImg check: ${this.state.currentShownWorks[i].id} isnull? ${foundImg}`);
          let imgRect = foundImg.getBoundingClientRect();*/
        returnHTML += (`<div style="transform: rotate(-90deg) scale(-1, 1); position: absolute; left: ${this.state.artPiecesCurrY[currID] * modifier}px; top: ${this.state.artPiecesCurrX[currID] * modifier}px; z-index: ${10 + i};">
          <img style="max-height: ${15 * modifier}em;" src="%img${i}%">
          (${currID})
          </div>`
          );
      }
      returnHTML += (`</div>`);
    }else{
      returnHTML += (`<div class="content">`);
      for(let i = 0; i < this.state.currentShownWorks.length; i++){
        let currID = this.state.currentShownWorks[i].id;
        returnHTML += (`<div style="transform: rotate(-90deg); position: absolute; left: ${this.state.artPiecesCurrX[currID]}px; top: ${this.state.artPiecesCurrY[currID]}px; z-index: ${10 + i};">
          <img style="max-height: 12em;" src="%img${i}%">
          <p style="font-size: 0.5em;">(${currID})</p>
          </div>`
          );
      }
      returnHTML += (`</div>`);
    }

      
    
    returnHTML += (`<div class="bottom-of-page">
    <div>
    <p class="fact-times">Index</p>`);

    //index.
    for(let i = 0; i < this.state.currentShownWorks.length; i++){
      let currID = this.state.currentShownWorks[i].id;
      if(this.state.currentShownWorks[i].name == "sys"){
        returnHTML += (`
        <p class="fact-times">(Fig. ${currID})</p>
        `);
      }else{
        returnHTML += (`
        <p class="fact-times">(${currID}) ${this.state.currentShownWorks[i].name}, ${this.state.currentShownWorks[i].title} (2023)</p>
        `);
      }
    }
    returnHTML += (`</div></div>`);
    
    let randomPressCount = Math.floor(Math.random() * 100) + 20;

    let maxWidth = 1200;
    let maxHeight = 800;

    console.log(`RANDOM randomPressCount: ${randomPressCount}`);
    
/*      for(let i = 0; i < randomPressCount; i++){
      console.log(`RANDOM PRESS: ${i}`);
        returnHTML += (`<a style="background-color: transparent; color:white; position: absolute; left: ${Math.floor(Math.random() * maxWidth)}px; top: ${Math.floor(Math.random() * maxHeight)}px; z-index: 99999;">
            PRESS
          </a>`
          );
    }   */

     let potLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    //fug it we hardcode
    let bigLetterLeft = -(Math.random() * 200);
    let bigLetterTop = -(Math.random() * 600) + 100;
    // let bigLetterLeft = Math.floor(Math.random() * (maxWidth * .5 ));
    //let bigLetterTop = Math.floor((Math.random() - .25) * (maxHeight * .5 ) - 500);
    //let bigLetterTop = Math.random() * -450;
    let letter = potLetters[Math.floor(Math.random() * potLetters.length)];

    returnHTML += (`<p style="position: absolute; z-index: 100; transform: rotate(-90deg); font-size: 1400px; margin: auto; left: ${bigLetterLeft}px; top: ${bigLetterTop}px; font-family:pantasia;">${letter}</p>`);/*
    returnHTML += (`<p style="font-family: pantasiareg; transform:rotate(-90deg); position:absolute; bottom:110px; left:-40px;z-index: 999999;">15 June 2023</p>
    <p style="font-family: pantasiareg; transform:rotate(-90deg); position:absolute; top:350px; left:-35px;z-index: 999999;">Bachelor of Design</p>
    <p style="font-family: pantasiareg; transform:rotate(-90deg); position:absolute; top:70px; left:-30px;z-index: 999999;">Graduate Showcase</p>
    <p style="font-family: pantasiareg; transform:rotate(-90deg); position:absolute; bottom:110px; right:-40px;z-index: 999999;">Building 9 Level 1</p>
    <p style="font-family: pantasiareg; transform:rotate(-90deg); position:absolute; top:350px; right:-12px;z-index: 999999;">Bowen Street</p>
    <p style="font-family: pantasiareg; transform:rotate(-90deg); position:absolute; top:70px; right:-26px;z-index: 999999;">RMIT University</p>`);
    returnHTML += (`</div>`); */
/*
`
            <h1 style="mix-blend-mode: difference; position: absolute; z-index: 120; color: white; transform: rotate(-90deg); font-size: 1200px; margin: auto; left: ${bigLetterLeft}px; top: ${bigLetterTop}px; font-family: Schrijf;">${letter}</h1>
            <h1 style="mix-blend-mode: difference; position: absolute; z-index: 1; color: white; transform: rotate(-90deg); font-size: 1200px; margin: auto; left: ${bigLetterLeft}px; top: ${bigLetterTop}px; font-family: Schrijf;">${letter}</h1>
          `
          */

          /*
    returnHTML.push(`<div class="bottom-of-page">
      <div>
        <div class="fact-times"><br>Index</div>
        <p class="fact-times" style="cursor: pointer;">(3) Brooke Davis, Untitled (2023)</p>//change to variable
      </div>
    </div>`); 
*/


    returnHTML += (`</body>
    </html>`);


    console.log("returnHTML: " + returnHTML);
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

  sendPDF(formData){
    var self = this;
    axios({
      //url: "http://localhost:8000/index.php", 
      url: "https://p-r-e-s-s.com/php/index.php", 
      method: "POST",
      data: formData,
      headers: {
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
    }
    })
    .then(function(response) {
        console.log("outcome 1");
        console.log(response); 
        console.log("response.data: " + response.data); 
        self.setState({
          printResponse: response.data,
          emailSent: true
        });    
    })

    console.log("test save end");
  }

  generatePDF(){
    var pdfHTML = `${this.generatePDFHTML()}`;
    var formData = new FormData();

    //let potLetters = ['a', 'b'];
    let potLetters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
    let letter = potLetters[Math.floor(Math.random() * potLetters.length)];
    console.log(`letter: ${letter}`);
    formData.append("bigLetter", letter);

    formData.append("msg", "deez nuts");
    formData.append("pdf", "na");

    const textElement = document.getElementById(`root`);
    let textRect = textElement.getBoundingClientRect();

    formData.append("width", textRect.right);
    formData.append("height", textRect.bottom);
    formData.append("pdfHTML", pdfHTML);
    formData.append("userEmail", this.state.userEmail);
    formData.append("pdfName", `${this.state.userEmail.split("@")[0]} - ${Date.now()}.pdf`);
    //formData.append("pdfName", `${Math.random() * 10000000} - ${Date.now()}.pdf`);
    
    for(let i = 0; i < this.state.currentShownWorks.length; i++){
      formData.append("imgPaths[]", this.state.currentShownWorks[i].image);
      console.log("CURR IMG: ");
      console.log(this.state.currentShownWorks[i]);
    }

    this.sendPDF(formData);
  }

  startPDF(){
    console.log("test save start");
    window.history.pushState("object or string", "Title", "/print");
    this.scrollbarRef.current = 3;
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

    if(isMobile){
      return (
        <div className="focus-BG-mobile">
          <div className = "focus-Header-container">
            <div className = "focus-Header-mobile">{`${this.state.focusArtPiece.id}. ${this.state.focusArtPiece.name}, ${this.state.focusArtPiece.title} (${this.state.focusArtPiece.year})`}</div>
            <a className = "focus-Close-mobile" onTouchStart={() => this.removeFocusArtPiece()}> Close </a>
          </div>
          <img className="focus-Img"
            src={require(`./Img/${this.state.focusArtPiece.image}`)}
            />
            <p className="focus-Desc">{this.state.focusArtPiece.desc}</p>
            <div className="focus-Header">{this.state.focusArtPiece.contact}</div>
        </div>
      );
    }

    return (
        <div className="focus-BG">
          <div className = "focus-Header-container">
          <div className = "focus-Header">{`${this.state.focusArtPiece.id}. ${this.state.focusArtPiece.name}, ${this.state.focusArtPiece.title} (${this.state.focusArtPiece.year})`}</div>
          <a className = "focus-Close" onMouseDown={() => this.removeFocusArtPiece()}> Close </a>
          </div>
          <img className="focus-Img"
            src={require(`./Img/${this.state.focusArtPiece.image}`)}
            />
            <p className="focus-Desc">{this.state.focusArtPiece.desc}</p>
            <div className="focus-Header">{this.state.focusArtPiece.contact}</div>
        </div>
    );
  }

  showMenu(){
    this.setState({
      mobileShowMenu: true
    });
  }

  userAcknowledged() {
    if(this.state.isLoaded){
      this.setState({isAcknowledged:true});
    }
  }

  toggleMenu(){
    
    if(!this.state.mobileShowMenu){
      document.documentElement.style.setProperty('--mobileMenuDisplay',"inline-block");
  
    }else{
      document.documentElement.style.setProperty('--mobileMenuDisplay',"none");
  
    }
    
    this.setState({
      mobileShowMenu: !this.state.mobileShowMenu
    });
  }

  render() {

    if(this.state.isAcknowledged==false){
      return(
        <div onMouseUp={() => this.userAcknowledged()} className="ack-bg">
          <div className="ack-text">
            We acknowledge the traditional owners of the land on which RMIT University operates, the Boon Wurrung and Woi Wurrung language groups of the Eastern Kulin Nation. We acknowledge that sovereignty was never ceded, and extend our respects to elders past, present, and emerging. Always was, always will be, Aboriginal land. 
          </div>
        <br></br>
          <div className="ack-text">
            {this.state.isLoaded ? `${isMobile ? "Tap" : "Click"} to continue...`: ""}
          </div>
        </div>)
    }

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
    let printing = (this.scrollbarRef.current == 3);

    return (
      <div>
        <meta charSet="UTF-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
        <link rel="stylesheet" href="styles.css" />
        <link rel="icon" href="icon.png" /> 
        <title>Zachariah Micallef</title>
        <BrowserView>
          <div className="bottom-of-page" style={{zIndex:11, visibility: printing ? "hidden" : "visible"}}>
          <ScrollingBanner clickFunc = {this.scrollbarRef}/> 
              <div>
                <p className="fact-times">{this.state.mouseX}, {this.state.mouseY}</p>
                {this.getCurrentlyShownWorks()}
              </div>
          </div>
        </BrowserView>
        <MobileView>
          <div className="bottom-of-page" style={{visibility: printing ? "hidden" : "visible"}}>
            <div className="scrolling-banner-parent">
              <div className="scrolling-banner-child" onTouchStart = {(() => this.toggleMenu())}>
                <p className="helvetica">{this.state.mobileShowMenu ? "Close" : "Menu"}</p>
              </div>
            </div>
            <div style={{display: this.state.mobileShowMenu ? "inherit" : "none"}} >
              <ScrollingBanner clickFunc = {this.scrollbarRef}/> 
              <br></br>
              <br></br>
              <div className="scrolling-banner-parent">
                <a onTouchStart = {(() => this.startPDF())}><p className="helvetica-mobile">Print Screen</p></a>
                <a onTouchStart = {(() => this.clearPage())}><p className="helvetica-mobile">Clear Screen</p></a>
              </div>
            </div>
          </div>
            <div className="mobile-bottom-of-page" style={{visibility: printing ? "hidden" : "visible"}}>
              {this.getCurrentlyShownWorks()}
            </div>
          </MobileView>
        <div>
            {this.getPage()}
            {this.getFocusArtPiece()}
        </div>
      </div>
    );
  }
}

export default App;