import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardMedia from '@material-ui/core/CardMedia';


const styles = {
    // card: {
    //     maxWidth: 600
    // }
};

class ImageCard extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        image: PropTypes.object.isRequired
    };

    render() {
        const { classes, image } = this.props;
        const { url } = image;

        return (<img src={url} />);
    }
}

export default withStyles(styles)(ImageCard);
