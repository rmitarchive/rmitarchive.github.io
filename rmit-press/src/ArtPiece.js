import React from 'react';

//<div className="index-img"><img src={this.state.img}/></div>
//<div className="index-line"><span className="times">{this.state.id} - </span><span className="helvetica" onMouseOver={() => this.testHover()}>{this.state.title}</span></div>
class ArtPiece extends React.Component {
    constructor(props){
      super(props);
      //console.log("TEST: " + JSON.stringify(props));
      this.state = {
        id: props.id,
        img: props.img,
        title: props.title,
        hoverOverTextFunc: props.hoverOverTextFunc,
        hoverExitTextFunc: props.hoverExitTextFunc,

        coreInfo: props.coreInfo,
        currFilter: props.currFilter,

        imageShown: false,
        imageMoved: false,
        imageMoving: false,

        offsetX: 0,
        offsetY: 0,
        currX: 0,
        currY: 0,

        gridSnap: true

      };
    }

    clickText(props) {
      console.log("MOUSE DOWN");
      this.setState({
        imageShown: !this.state.imageShown
      })
    }

    startDragElement(props) {
      let e = window.event;
      console.log("MOUSE DOWN 2");
        
      const textElement = document.getElementById(`${this.state.id}Img`);
      let textRect = textElement.getBoundingClientRect();


      this.setState({
        imageMoved: true,
        imageMoving: true,
        offsetX: e.clientX - textRect.left,
        offsetY: e.clientY - textRect.top,
        currX: textRect.left,
        currY: textRect.top,
      })

      this.continueDragElement();
    }

    stopDragElement(props) {
      console.log("MOUSE DOWN 3");
      this.setState({
        imageMoving: false
      })
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
      }
    }

    getImage(){
      
      if(this.state.imageMoved){
        return(
          <img className="dragImg"
            id={`${this.state.id}Img`}
            draggable="false" 
            src={require(`./Img/${this.state.coreInfo.image}`)}
            style={{
              position: "absolute",
              left: `${this.state.currX}px`,
              top: `${this.state.currY}px`
            }}
            onMouseDown={() => this.continueDragElement(this.state)}
            />
        );
      }else{
        return(
          <img className="dragImg"
            id={`${this.state.id}Img`}
            draggable="false" 
            src={require(`./Img/${this.state.coreInfo.image}`)}
            onMouseDown={() => this.startDragElement(this.state)}
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

      //console.log("NAME: " + this.state.coreInfo.name);

      return(<div>
                <a id={this.state.id} 
                  className="student" 
                  style={{color: `rgb(${addedColor[0]}, ${addedColor[1]}, ${addedColor[2]})`}}
                  onMouseLeave={() => this.state.hoverExitTextFunc(this.state)} 
                  onMouseMove={() => this.state.hoverOverTextFunc(this.state)}
                  onMouseDown={() => this.clickText(this.state)}
                  >

                    {this.state.coreInfo.name} {filteredIn ? `, ${this.state.coreInfo.title}, 2023.` : ""}
                </a>
                <div style={{display: this.state.imageShown ? "inherit" : "none"}} 
                id="draggable" 
                onMouseDown={() => this.startDragElement(this.state)}
                onMouseMove={() => this.continueDragElement(this.state)}
                onMouseUp={() => this.stopDragElement(this.state)}
                >
                  {this.getImage()}
              </div>
              </div>)
    }
  }
  
  export default ArtPiece;