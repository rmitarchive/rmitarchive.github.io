import React from 'react';

class ArtPiece extends React.Component {
    constructor(props){
      super(props);
      
      window.addEventListener('mousemove', (event) => {
        //console.log("this.state.showText: " + this.state.showText);
        this.continueDragElement(this.state);
      });
      

      window.addEventListener('mouseup', (event) => {
        this.stopDragElement(this.state);
      });



      this.state = {
        isRandomImage: props.isRandomImage,
        isInstructionalImage: props.isInstructionalImage,

        isVisible: props.isRandomImage,
        
        id: props.coreInfo.id,
        code: props.coreInfo.code,
        title: props.title,
        year: props.year,
        hoverOverTextFunc: props.hoverOverTextFunc,
        hoverExitTextFunc: props.hoverExitTextFunc,
        continueDragElement: props.continueDragElement,
        stopDragElement: props.stopDragElement,
        startDragElement: props.startDragElement,
        clickText: props.clickText,

        incrementZIndex: props.incrementZIndex,

        openFocusArtPiece: props.openFocusArtPiece,

        coreInfo: props.coreInfo,
        currFilter: props.currFilter,

        imageShown: props.imageShown,
        imageMoved: props.imageMoved,
        imageMoving: false, //i think it should just be forced false.
        //imageMoving: props.imageMoving,

        offsetX: props.offsetX,
        offsetY: props.offsetY,
        currX: props.currX,
        currY: props.currY,

        gridSnap: props.gridSnap,
        currZIndex: props.currZIndex,
        isMobile: props.isMobile,
        showText: props.showText,
        adjustingInstructional: false,
        instructionalIntervalFunc: null
      };

      //console.log("ENTER");
      //this.adjustInstructional();
      /*if(this.state != null && this.state.isInstructionalImage && !this.state.imageMoved){
        this.adjustInstructional();
      }*/
    } 

    componentDidUpdate(){
      if(this.state != null && this.state.isInstructionalImage && !this.state.imageMoved && !this.state.adjustingInstructional){
        const interval = setInterval(() => {
          this.adjustInstructional();
        }, 100);
        
        this.setState({
          adjustingInstructional: true,
          instructionalIntervalFunc: interval
        });

        //this.adjustInstructional();
      }
    }

    adjustInstructional(props){
      if(this.state.imageMoved){
        if(this.state.instructionalIntervalFunc != null){
          clearInterval(this.state.instructionalIntervalFunc);
        }
        return;
      }

      console.log(`artpiece move: A`);
      const textElement = document.getElementById(`root`);
      let textRect = textElement.getBoundingClientRect(); 
      let instructionalElement = document.getElementById(`51Img`);

      if(instructionalElement == null){
        //setTimeout(this.adjustInstructional(), 100000);
        return;
      }

      if(instructionalElement != null){ // && instructionalElement.getBoundingClientRect().width != 0
        console.log(`artpiece move: B`);
        let instructionalRect = instructionalElement.getBoundingClientRect();

        if(instructionalRect.width == 0){
          //setTimeout(this.adjustInstructional(), 100000);
          return;
        }

        if(instructionalRect.width != 0){
          let x = (textRect.right / 2) - (instructionalRect.width / 2);
          let y = (textRect.bottom / 2) - (instructionalRect.height / 2);

          console.log(`artpiece textRect: ${textRect.right}, ${textRect.bottom}`);
          console.log(`artpiece instructionalRect: ${instructionalRect.width}, ${instructionalRect.height}`);
          console.log(`artpiece move C: ${x}, ${y}`);

          this.setState({
            currX: x, 
            currY: y,
            imageMoved: true
          }, () => {
            this.state.continueDragElement(this.state);
          });

        }
      }
    }
/*
    sleep(milliseconds) {
      const date = Date.now();
      let currentDate = null;
      do {
        currentDate = Date.now();
      } while (currentDate - date < milliseconds);
    }
*/
    clickText(props) {
      const toHide = document.getElementById(this.state.coreInfo.id+"DD");

      //if red, pageclear has happened.
      if(toHide.style.color != "red"){ 
        console.log(`click 1 ${this.state.imageShown}`);
        this.setState({
          imageShown: !this.state.imageShown
        })
        console.log(`click 1b ${this.state.imageShown}`);
        this.state.clickText(this.state, !this.state.imageShown, false);

        if(!this.state.imageMoved && this.state.isMobile){
          this.placeRandomly();
          //this.startDragElement(this.state);
        }
      }else{
        toHide.style.display = "inherit";
        toHide.style.color = "black";
        //console.log("MOUSE DOWN == red");
        this.setState({
          imageShown: true
        })
        this.state.clickText(this.state, true, true);
      }
    }

    placeRandomly(){
      const textElement = document.getElementById(`root`);
      let textRect = textElement.getBoundingClientRect();

      let width = textRect.right;
      let height = textRect.bottom;

      let newX = (Math.random() * (width * .4)) + (width * .1);
      let newY = (Math.random() * (height * .4)) + (height * .1);

      let newZIndex = this.state.incrementZIndex();
    
      this.state.startDragElement(this.state);

      this.setState({
        imageMoved: true,
        currX: newX,
        currY: newY,
        currZIndex: newZIndex
      })
    }

    startDragElement(props) {
      console.log("start drag");
      let e = window.event;
      //console.log("MOUSE DOWN 2");
        
      let textElement = document.getElementById(`${this.state.id}DDIMG`);
      //const textElement = document.getElementById(`${this.state.id}Img`);

      if(textElement == null){
        textElement = document.getElementById(`${this.state.id}Img`);
      }
      
      let textRect = textElement.getBoundingClientRect();

      let newZIndex = this.state.incrementZIndex();

      //console.log("NEWZINDEX: " + newZIndex);
      let newX = 0;
      let newY = 0;

      if(this.state.isMobile){
        if(e.changedTouches != null){
          newX = e.changedTouches[0].clientX - textRect.left;
          newY = e.changedTouches[0].clientY - textRect.top;
        }else{//no event.
          newX = 0;
          newY = 0;
        }
      }else{
        newX = e.clientX - textRect.left;
        newY = e.clientY - textRect.top;
      }

      console.log(`newZIndex: ${newZIndex}`);

      this.setState({
        imageMoved: true,
        imageMoving: true,
        offsetX: newX,
        offsetY: newY,
        currX: textRect.left,
        currY: textRect.top,
        currZIndex: newZIndex
      })

      this.state.startDragElement(this.state);

      this.continueDragElement();
    }

    stopDragElement(props) {
      //console.log("MOUSE DOWN 3");
      if(this.state.imageMoving){
        console.log("stop drag");
        this.setState({
          imageMoving: false
        })
      }

      //this.state.continueDragElement(this.state);
    }

    continueDragElement(props) {
      //console.log("try continueDragElement: " + JSON.stringify(this.state));
      if(this.state.imageMoving){
        //console.log("do continueDragElement");
        let e = window.event;      
        //console.log("MOUSE DOWN 2");

        const textElement = document.getElementById(`${this.state.id}Img`);
        let textRect = textElement.getBoundingClientRect();

        let newX = 0;
        let newY = 0;

        
        if(this.state.isMobile){
          if(e.touches.length > 1)
          {
            return;
          }
          newX = e.changedTouches[0].clientX - this.state.offsetX;
          newY = e.changedTouches[0].clientY - this.state.offsetY;
        }else{
          newX = e.clientX - this.state.offsetX;
          newY = e.clientY - this.state.offsetY;
        }

        this.setState({
          currX: this.state.gridSnap ? newX - (newX % 10) : newX,
          currY: this.state.gridSnap ? newY - (newY % 10) : newY
        })

        this.state.continueDragElement(this.state);
      }
    }

    getImage(){
      if(this.state.imageMoved){
        return(
          <div
          id={this.state.coreInfo.id + "DDIMG"}
          key={this.state.coreInfo.id + "DDIMG"}
          className="drag-div"
          style={{
            position: "absolute",
            left: `${this.state.currX}px`,
            top: `${this.state.currY}px`,
            zIndex: this.state.currZIndex
          }}
          //onMouseDown={() => this.continueDragElement(this.state)}
          >
            <a onMouseDown={() => this.clickText(this.state)} className="dragImgIndexLine dragImgIndex">Hide</a>
            <img className={this.state.isInstructionalImage ? "bigDragImg" : "dragImg"}
              key={this.state.coreInfo.id + "DIMG"}
              id={`${this.state.coreInfo.id}Img`}
              draggable="false" 
              src={require(`./Img/${this.state.coreInfo.image}`)}
              onTouchStart={() => this.startDragElement(this.state)}
              onTouchEnd={() => this.stopDragElement(this.state)}
              onTouchMove={() => this.continueDragElement(this.state)}

              onMouseDown={() => this.startDragElement(this.state)}
              onMouseUp={() => this.stopDragElement(this.state)}
              />
              <div className="dragImgIndexLine">
                <div className="dragImgIndex">{
                  this.state.isRandomImage ? ` (Fig. ${this.state.coreInfo.code})`
                  : ` ${this.state.coreInfo.code}.`
                  }
                </div>
                <a 
                onMouseDown={this.state.isRandomImage ? null : () => this.state.openFocusArtPiece(this.state.coreInfo)} 
                className="dragImgIndex"
                > {
                  this.state.isRandomImage ? `` : this.state.isMobile ? `${this.state.coreInfo.name} (...)`
                  : `${this.state.coreInfo.name} ( ... )`}
                </a>
              </div> 
          </div>
        );
      }else{
        return(
          <img className={this.state.isInstructionalImage ? "bigDragImg" : "dragImg"}
            key={this.state.coreInfo.id + "DLIMG"}
            id={`${this.state.coreInfo.id}Img`}
            draggable="false" 
            src={require(`./Img/${this.state.coreInfo.image}`)}
            onTouchStart={() => this.startDragElement(this.state)}
            onTouchEnd={() => this.stopDragElement(this.state)}

            onMouseDown={() => this.startDragElement(this.state)}
            onMouseUp={() => this.stopDragElement(this.state)}
            />
      );
      }
    }

    render() {

      if(this.state != null && this.state.isInstructionalImage && !this.state.imageMoved){
        console.log(`STATE: ${JSON.stringify(this.state)}`);
        //this.adjustInstructional();
      }

      


      var colors = [];
      var filteredIn = false;

      this.state.coreInfo.tags.forEach(tag => {
        if(this.state.currFilter[tag]){
          switch(tag){
            case "digital":
              var c = [98, 168, 229];
              colors.push(c);
              //color = '#62A8E5';
              break;
            case "print":
              var c = [255, 72, 176];
              colors.push(c);
              //color = '#FF48B0';
              break;
            case "illustration":
              var c = [241, 80, 96];
              colors.push(c);
              //color = '#F15060';
              break;
            case "identity":
              var c = [0, 169, 92];
              colors.push(c);
              //color = '#00A95C';
              break;
            case "sitebased":
              var c = [255, 108, 47];
              colors.push(c);
              //color = '#FF6C2f';
              break;
            case "multimedia":
              var c = [157, 122, 210];
              colors.push(c);
              //color = '#9D7AD2';
              break;
            case "object":
              var c = [253, 231, 0];
              colors.push(c);
              //color = '#FFE800';
              break;
          }
          //color = '#0078BF';
          filteredIn = true;
        }
      });

      //console.log("COLORS: " + colors);

      var addedColor = [0,0,0];
      colors.forEach(color => {
        addedColor[0] += color[0];
        addedColor[1] += color[1];
        addedColor[2] += color[2];
      });

      if(filteredIn){
        addedColor = [addedColor[0] / colors.length, addedColor[1] / colors.length, addedColor[2] / colors.length];
      } else {
        addedColor = [255,255,255]
      }

      //console.log("NAME: " + this.state);
      //console.log(`check: ${this.state.coreInfo.id} - ${this.state.imageShown}`);

      return(<div key = {this.state.coreInfo.id + "AP"}>
                <a 
                  key={this.state.coreInfo.id + "AD"}
                  id={this.state.coreInfo.id} 
                  className="student" 
                  style={{
                    backgroundColor: `rgb(${addedColor[0]}, ${addedColor[1]}, ${addedColor[2]})`,
                    visibility: (this.state.isRandomImage) ? "hidden" : "inherit"
                  }}
                  onMouseLeave={() => this.state.hoverExitTextFunc(this.state)} 
                  onMouseMove={() => this.state.hoverOverTextFunc(this.state)}
                  onMouseDown={() => this.clickText(this.state)}
                  >

                    {this.state.coreInfo.name} {filteredIn ? `, ${this.state.coreInfo.title}` : ""}
                </a>
                <div 
                key={this.state.coreInfo.id + "DD"}
                id={this.state.coreInfo.id + "DD"} 
                style={{display: this.state.imageShown ? "inherit" : "none"}} 
                //onMouseDown={() => this.startDragElement(this.state)}
                //onMouseUp={() => this.stopDragElement(this.state)}
                >
                  {this.getImage()}
                </div>
              </div>)
    }
  }
  
  export default ArtPiece;