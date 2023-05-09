import React from 'react';

class ArtPiece extends React.Component {
    constructor(props){
      super(props);
      //console.log("TEST: " + JSON.stringify(props));
      
      window.addEventListener('mousemove', (event) => {
        this.continueDragElement(this.state);
      });

      this.state = {
        isRandomImage: props.isRandomImage,
        isVisible: props.isRandomImage,
        
        id: props.coreInfo.id,
        title: props.title,
        hoverOverTextFunc: props.hoverOverTextFunc,
        hoverExitTextFunc: props.hoverExitTextFunc,
        continueDragElement: props.continueDragElement,
        stopDragElement: props.stopDragElement,
        startDragElement: props.startDragElement,
        clickText: props.clickText,

        incrementZIndex: props.incrementZIndex,

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
        currZIndex: props.currzIndex
      };
    } 

    clickText(props) {

      const toHide = document.getElementById(this.state.coreInfo.id+"DD");
      
      if(toHide.style.color != "red"){

        //console.log("MOUSE DOWN != red");
        this.setState({
          imageShown: !this.state.imageShown
        })
      }else{
        toHide.style.display = "inherit";
        toHide.style.color = "black";

        //console.log("MOUSE DOWN == red");
        this.setState({
          imageShown: true
        })
      }

      this.state.clickText(this.state);
    }

    startDragElement(props) {
      let e = window.event;
      //console.log("MOUSE DOWN 2");
        
      const textElement = document.getElementById(`${this.state.id}Img`);
      let textRect = textElement.getBoundingClientRect();

      let newZIndex = this.state.incrementZIndex();

      //console.log("NEWZINDEX: " + newZIndex);

      this.setState({
        imageMoved: true,
        imageMoving: true,
        offsetX: e.clientX - textRect.left,
        offsetY: e.clientY - textRect.top,
        currX: textRect.left,
        currY: textRect.top,
        currzIndex: newZIndex
      })

      this.state.startDragElement(this.state);

      this.continueDragElement();
    }

    stopDragElement(props) {
      //console.log("MOUSE DOWN 3");
      this.setState({
        imageMoving: false
      })

      this.state.continueDragElement(this.state);
    }

    continueDragElement(props) {
      if(this.state.imageMoving){
        let e = window.event;      
        //console.log("MOUSE DOWN 2");

        const textElement = document.getElementById(`${this.state.id}Img`);
        let textRect = textElement.getBoundingClientRect();

        let newX = e.clientX - this.state.offsetX;
        let newY = e.clientY - this.state.offsetY;

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
            zIndex: this.state.currzIndex
          }}
          onMouseDown={() => this.state.continueDragElement(this.state)}>
            <img className="dragImg"
              key={this.state.coreInfo.id + "DIMG"}
              id={`${this.state.coreInfo.id}Img`}
              draggable="false" 
              src={require(`./Img/${this.state.coreInfo.image}`)}
              />
             <div className="dragImgIndex">{
             this.state.isRandomImage ? ` (Fig. ${this.state.coreInfo.id})`
             : ` (${this.state.coreInfo.id})`
             }</div>
          </div>
        );
      }else{
        return(
          <img className="dragImg"
            key={this.state.coreInfo.id + "DLIMG"}
            id={`${this.state.coreInfo.id}Img`}
            draggable="false" 
            src={require(`./Img/${this.state.coreInfo.image}`)}
            onMouseDown={() => this.state.startDragElement(this.state)}
            />
      );
      }
    }

    render() {
      var colors = [];
      var filteredIn = false;
      
      this.state.coreInfo.tags.forEach(tag => {
        if(this.state.currFilter[tag]){
          switch(tag){
            case "digital":
              var c = [0, 121, 191];
              colors.push(c);
              //color = '#0078BF';
              break;
            case "identity":
              var c = [255, 72, 176];
              colors.push(c);
              //color = '#FF48B0';
              break;
            case "logo":
              var c = [241, 80, 96];
              colors.push(c);
              //color = '#F15060';
              break;
            case "print":
              var c = [0, 169, 92];
              colors.push(c);
              //color = '#00A95C';
              break;
            case "poster":
              var c = [255, 108, 47];
              colors.push(c);
              //color = '#FF6C2f';
              break;
            case "layout":
              var c = [0, 131, 138];
              colors.push(c);
              //color = '#00838A';
              break;
            case "web":
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
                    visibility: this.state.isRandomImage ? "hidden" : "inherit"
                  }}
                  onMouseLeave={() => this.state.hoverExitTextFunc(this.state)} 
                  onMouseMove={() => this.state.hoverOverTextFunc(this.state)}
                  onMouseDown={() => this.clickText(this.state)}
                  >

                    {this.state.coreInfo.name} {filteredIn ? `, ${this.state.coreInfo.title} (2023)` : ""}
                </a>
                <div 
                key={this.state.coreInfo.id + "DD"}
                id={this.state.coreInfo.id + "DD"} 
                style={{display: this.state.imageShown ? "inherit" : "none"}} 
                onMouseDown={() => this.startDragElement(this.state)}
                //onMouseMove={() => this.continueDragElement(this.state)}
                onMouseUp={() => this.stopDragElement(this.state)}
                //onMouseLeave={() => this.stopDragElement(this.state)}
                >
                  {this.getImage()}
                </div>
              </div>)
    }
  }
  
  export default ArtPiece;