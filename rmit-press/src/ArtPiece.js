import React from 'react';

class ArtPiece extends React.Component {
    constructor(props){
      super(props);
      console.log("TEST: " + JSON.stringify(props));
      
      this.state = {
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
      console.log("MOUSE DOWN");
      this.setState({
        imageShown: !this.state.imageShown
      })
      this.state.clickText(this.state);
    }

    startDragElement(props) {
      let e = window.event;
      console.log("MOUSE DOWN 2");
        
      const textElement = document.getElementById(`${this.state.id}Img`);
      let textRect = textElement.getBoundingClientRect();

      let newZIndex = this.state.incrementZIndex();

      console.log("NEWZINDEX: " + newZIndex);
      
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
      console.log("MOUSE DOWN 3");
      this.setState({
        imageMoving: false
      })

      this.state.continueDragElement(this.state);
    }

    continueDragElement(props) {
      if(this.state.imageMoving){
        let e = window.event;      
        console.log("MOUSE DOWN 2");

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
          <img className="dragImg"
            id={`${this.state.coreInfo.id}Img`}
            draggable="false" 
            src={require(`./Img/${this.state.coreInfo.image}`)}
            style={{
              position: "absolute",
              left: `${this.state.currX}px`,
              top: `${this.state.currY}px`,
              zIndex: this.state.currzIndex
            }}
            onMouseDown={() => this.state.continueDragElement(this.state)}
            />
        );
      }else{
        return(
          <img className="dragImg"
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
              var c = [132, 0, 50];
              colors.push(c);
              //color = '#840032';
              break;
            case "identity":
              var c = [229, 149, 0];
              colors.push(c);
              //color = '#E59500';
              break;
            case "logo":
              var c = [0, 38, 66];
              colors.push(c);
              //color = '#002642';
              break;
            case "print":
              var c = [4, 167, 119];
              colors.push(c);
              //color = '#04A777';
              break;
            case "poster":
              var c = [83, 152, 190];
              colors.push(c);
              //color = '#5398BE';
              break;
            case "layout":
              var c = [212, 231, 158];
              colors.push(c);
              //color = '#D4E79E';
              break;
            case "web":
              var c = [238, 252, 87];
              colors.push(c);
              //color = '#EEFC57';
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
      }

      //console.log("NAME: " + this.state);

      return(<div>
                <a id={this.state.coreInfo.id} 
                  className="student" 
                  style={{color: `rgb(${addedColor[0]}, ${addedColor[1]}, ${addedColor[2]})`}}
                  onMouseLeave={() => this.state.hoverExitTextFunc(this.state)} 
                  onMouseMove={() => this.state.hoverOverTextFunc(this.state)}
                  onMouseDown={() => this.clickText(this.state)}
                  >

                    {this.state.coreInfo.name} {filteredIn ? `, ${this.state.coreInfo.title}, 2023.` : ""}
                </a>
                <div style={{display: this.state.imageShown ? "inherit" : "none"}} 
                id={this.state.coreInfo.id} 
                onMouseDown={() => this.startDragElement(this.state)}
                onMouseMove={() => this.continueDragElement(this.state)}
                onMouseUp={() => this.stopDragElement(this.state)}
                onMouseLeave={() => this.stopDragElement(this.state)}
                >
                  {this.getImage()}
              </div>
              </div>)
    }
  }
  
  export default ArtPiece;