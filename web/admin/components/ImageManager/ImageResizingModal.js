import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Button from '@material-ui/core/Button';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { Divider } from '@material-ui/core';
import { AdminContext } from '../../Admin';
import { API_BASE } from 'Shared/config/apiEndpoints';

import { axios } from 'Shared/AuthGuard';

const styles = theme => ({
    paper: {
        position: 'absolute',
        width: theme.spacing.unit * 50,
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
});

function getModalStyle() {
    const top = 25;
    const left = 25;

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
        height: '75%',
        width: '75%'
    };
}

class ImageResizingModal extends React.Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        aspect: PropTypes.string
    };

    static defaultProps = {
        open: false,
        aspect: '1X1'
    };

    constructor(props) {
        super(props);

        const { aspect, image } = props;
        const aspectParts = aspect.split('X');

        const crop = {
            aspect: parseInt(aspectParts[0]) / parseInt(aspectParts[1]),
            width: 200,
            x: 0,
            y: 0,
            naturalHeight: 0,
            naturalWidth: 0,
            screenHeight: 0,
            screenWidth: 0
        };

        this.state = {
            src: image.url,
            crop,
            open: false,
            completeCrop: {}
        };
    }

    handleOpen = () => {
        this.setState({ open: true });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    onCropComplete = (completeCrop) => {
        this.setState({ completeCrop });
    };

    onCropChange = (crop) => {
        this.setState({ crop });
    };

    onImageLoaded = (image) => {
        this.setState({
            naturalHeight: image.naturalHeight,
            naturalWidth: image.naturalWidth,
            screenHeight: image.height,
            screenWidth: image.width
        });
    };

    startProcessing = (eventId) => () => {
        this.setState({ processing: true });
        const { image } = this.props;
        const { completeCrop, screenWidth, screenHeight } = this.state;

        const percentageWidth = (completeCrop.width / screenWidth) * 100;
        const percentageHeight = (completeCrop.width / screenHeight) * 100;

        const percentStartX = (completeCrop.x / screenWidth) * 100;
        const percentStartY = (completeCrop.y / screenHeight) * 100;

        console.log('percentageWidth', percentageWidth);
        console.log('percentageHeight', percentageHeight);

        console.log('percentStartX', percentStartX);
        console.log('percentStartY', percentStartY);

        const cropSettings = {
            ...image,
            x: percentStartX,
            y: percentStartY,
            width: percentageWidth,
            height: percentageHeight,
            aspect: completeCrop.aspect,
            eventId
        };

        console.log('cropSettings', cropSettings);

        axios.post(`${API_BASE}/image/process`, cropSettings)
            .then((results) => {
                // TODO: Give feedback to the user that the processing has started
                console.log(results);
            })
    };

    render() {
        const { classes, aspect } = this.props;
        const { open, src, crop, processing } = this.state;

        return (
            <AdminContext.Consumer>
                {({ currentEventId }) => (
                    <React.Fragment>
                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={open}
                            onClose={this.handleClose}
                        >
                            <div className={classes.paper} style={getModalStyle()}>
                                {src && (
                                    <ReactCrop
                                        src={src}
                                        crop={crop}
                                        onImageLoaded={this.onImageLoaded}
                                        onComplete={this.onCropComplete}
                                        onChange={this.onCropChange}
                                    />
                                )}
                                <Divider />
                                {processing ? 'Processing...' : (
                                    <Button size="small" color="primary" onClick={this.startProcessing(currentEventId)}>
                                        Generate Images
                                    </Button>
                                )}
                                <Button size="small" color="primary" onClick={this.handleClose}>
                                    Cancel
                                </Button>
                            </div>
                        </Modal>

                        <Button size="small" color="primary" onClick={this.handleOpen}>
                            Create {aspect}
                        </Button>
                    </React.Fragment>
                )}
            </AdminContext.Consumer>
        );
    }
}

export default withStyles(styles)(ImageResizingModal);
