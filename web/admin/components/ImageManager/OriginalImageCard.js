import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import ImageResizingModal from './ImageResizingModal';

const styles = {
    card: {
        maxWidth: 345
    },
    media: {
        height: 200
    }
};

class OriginalImageCard extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        image: PropTypes.object.isRequired
    };

    state = {
        resizingModalOpen: false,
        resizingAspect: '1X1'
    };

    render() {
        const { resizingModalOpen, resizingAspect } = this.state;
        const { classes, image } = this.props;
        const { url } = image;

        return (
            <React.Fragment>

                <Card className={classes.card}>
                    <CardActionArea>
                        <CardMedia
                            className={classes.media}
                            image={url}
                            title="Image"
                        />
                    </CardActionArea>
                    <CardActions>
                        <ImageResizingModal aspect="1X1" image={image} />
                        <ImageResizingModal aspect="5X2" image={image} />
                        <ImageResizingModal aspect="16X9" image={image} />
                    </CardActions>
                </Card>
            </React.Fragment>
        );
    }
}

export default withStyles(styles)(OriginalImageCard);
