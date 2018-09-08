import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { db } from './firebase';
import Grid from '@material-ui/core/Grid';
import { withStyles } from '@material-ui/core/styles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import Icon from '@material-ui/core/Icon';
import IconButton from '@material-ui/core/IconButton';
import StarRateIcon from '@material-ui/icons/Star';
import StarRateBorderIcon from '@material-ui/icons/StarBorder';
import HalfStarIcon from '@material-ui/icons/StarHalf';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';

const styles = theme => ({
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 200,
  },
  menu: {
    width: 200,
  },
  button: {
     margin: theme.spacing.unit,
  },
  input: {
     display: 'none',
  },
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
});

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      reviews:{},
      name:"",
      email:"",
      multiline:"",
      reviewMessage:"",
      hoverValue: 0,
      filled:1,
      value:1,
      noReviews:false,
      averageRating:0,
      reviewProduct:false,
      date: new Date(Date.now()).toLocaleString()
    };
  }

  componentDidMount() {
    db.getReviews(12123, (snapshot, response) => {
        console.log(snapshot.val())
        if(snapshot.val() === null){
          this.setState({ reviews:{}, noReviews:true })
        }else{
          let reviews = snapshot.val()
          let sumOfRating = 0;
          for (var property1 in reviews) {
            sumOfRating += parseInt(reviews[property1].stars)
          }
          let amountOfReviews = Object.keys(reviews).length
          let averageReview = sumOfRating/amountOfReviews
          this.setState({ reviews: snapshot.val(), averageRating: averageReview.toFixed(2)})
        }
    })
  }

  handleChange = name => event => {
    this.setState({
      [name]: event.target.value,
    });
  };

  postReview = () =>{
    db.doCreateReview(12123, this.state.reviewMessage, this.state.email, this.state.name, this.state.value)
           .then(() => {
             
           })
           .catch(error => {

           });
  }

  renderIcon(i){
    const filled = i <= this.state.value
    const hovered = i <= this.state.hoverValue

    if ((hovered && !filled) || (!hovered && filled)) {
        return  <StarRateIcon />
      } else if (filled) {
        return  <StarRateIcon />
      } else {
        return <StarRateBorderIcon />
      }
  }

  isInt(n) {
    return n % 1 === 0;
  }

  getStars(n, reviewId){
    let stars = []
    for (let i = 1; i <= n; i++) {
     stars.push(
           <StarRateIcon color="primary" key={i + reviewId} />
       )
    }
    if(stars.length < 5){
      for (let j = 1; j <= 5 - n; j++) {
           stars.push(
                 <StarRateBorderIcon color="primary" key={j + reviewId + 'empty'} />
             )
          }
    }
    return stars
  }

  getAverageStars(){

    const averageRating = []
    for (let i = 1; i <= this.state.averageRating; i++) {
     averageRating.push(
           <StarRateIcon color="primary" key={i} />
       )
    }
    if(!this.isInt(this.state.averageRating)){
     averageRating.push(
           <HalfStarIcon color="primary" />
       )
    }
    if(averageRating.length < 5){
     var averageRatingConst = averageRating.length
      for (let j = 1; j <= 7 - averageRating.length; j++) {
       console.log('loop')
       console.log(averageRating.length)
           averageRating.push(
                 <StarRateBorderIcon color="primary" key={j +'empty'} />
             )
          }
    }
    return averageRating
  }

  render() {
     const { classes } = this.props;
     const rating = []
     for (let i = 1; i <= 5; i++) {
      rating.push(
          <IconButton key={i} 
            color="primary" 
            className={classes.button} 
            aria-label="Delete"
            onMouseEnter={() => this.setState({hoverValue: i})}
            onMouseLeave={() => this.setState({hoverValue: this.state.value})}
            onClick={() => this.setState({value: i})}
          >
            {this.renderIcon(i)}
          </IconButton>
        )
     }

     // const averageRating = []

     
     // for (let i = 1; i <= this.state.averageRating; i++) {
     //  averageRating.push(
     //        <StarRateIcon color="primary" key={i} />
     //    )
     // }
     // if(!this.isInt(this.state.averageRating)){
     //  averageRating.push(
     //        <HalfStarIcon color="primary" />
     //    )
     // }
     // if(averageRating.length < 5){
     //  console.log(averageRating.length)
     //   for (let j = 1; j <= 5 - averageRating.length; j++) {
     //    console.log('loop')
     //        averageRating.push(
     //              <StarRateBorderIcon color="primary" key={j +'empty'} />
     //          )
     //       }
     // }

     const review = (
      <Grid
       container
       direction="row"
       justify="center"
       alignItems="center"
       >
        <form className={classes.container} noValidate autoComplete="off">
        <Grid item xs={12} sm={6}>
          <TextField
            id="name"
            label="Name"
            value={this.state.name}
            onChange={this.handleChange('name')}
            className={classes.textField}
            margin="normal"
          />
         </Grid>
         <Grid item xs={12} sm={6}>
          <TextField
            id="email"
            label="Email"
            value={this.state.email}
            onChange={this.handleChange('email')}
            className={classes.textField}
            margin="normal"
          />
         </Grid>
         <Grid item xs={12} >
          <TextField
            id="multiline-flexible"
            label="Review"
            multiline
            rowsMax="15"
            value={this.state.reviewMessage}
            onChange={this.handleChange('reviewMessage')}
            className={classes.textField}
            margin="normal"
            fullWidth={true}
          />
         </Grid>

         <Grid item xs={12} >
          {rating}
          </Grid>

          <Grid item xs={12}>
            <Button onClick={()=>this.postReview()} variant="contained" color="primary" className={classes.button}>Post Review</Button>
          </Grid>
        </form>
      </Grid>
    )

     const reviewThisProductButton = (
            <Button variant="contained" 
              color="primary" 
              onClick={()=>this.setState({reviewProduct:!this.state.reviewProduct})} 
              className={classes.button}
            >
            Review this product
            </Button>)

    return (
      <div className="App">

        {this.state.noReviews ? <h1>There are no product reviews</h1> : null}
          <Grid container direction="row" justify="space-between" alignItems="center">
           <div>
            <Typography align='left' variant="headline" component="h3">
              Product Name
            </Typography>
            <Typography align='left' component="p">
              Average Customer Review(s): {this.state.averageRating}
            </Typography>
            {this.getAverageStars()}
           </div>
            {this.state.reviewProduct ? review : reviewThisProductButton}
          </Grid>
          <Divider style={{marginBottom:20}} />
         <Grid container direction="column" justify="center" alignItems="center" spacing={24}>
          {Object.keys(this.state.reviews).map(i=>{ 
           return(
              <div style={{marginBottom:5}} key={i}>
                  <Paper className={classes.root} elevation={1}>
                    <Typography align='left' variant="headline" component="h3">
                      {this.getStars(this.state.reviews[i].stars,i)}
                    </Typography>
                    <Typography align='left' component="p" gutterBottom>
                      {this.state.reviews[i].name} on 7/29/2018
                    </Typography>
                    <Typography align='left' variant="subheading">
                      {this.state.reviews[i].message}
                    </Typography>
                  </Paper>
              </div>
             )
          })}
          </Grid>

      </div>
    );
  }
}

export default withStyles(styles)(App);