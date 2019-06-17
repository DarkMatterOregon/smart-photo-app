import React, {Component} from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import DropzoneS3Uploader from 'react-dropzone-s3-uploader'
import ReactCrop from 'react-image-crop';
import {sendCropRequest, fetchStatusOfJobId} from '../../actions';


import '../../../node_modules/react-image-crop/dist/ReactCrop.css';

const STEP_UPLOAD = 'uploadStep';
const STEP_CROP = 'croppingStep';
const STEP_WAIT = 'processingWait';
const STEP_ERROR = 'errorStep';
const STEP_SHOW_IMAGE = 'showImage';

const uploaderStyle = {
    padding: 5,
    border: 'dashed 2px #999',
    borderRadius: 5,
    position: 'relative',
    cursor: 'pointer'
};

const cropperStyle = {
    minHeight: 275,
    position: 'relative',
    background: '#CCCCCC',
    marginBottom: 5,
    padding: 5
};

const uploaderProps = {
    style: uploaderStyle,
    signingUrl: '/s3/sign',
    accept: 'image/*',
    maxFileSize: 1024 * 1024 * 50,
    server: 'http://localhost:3001',
    s3Url: 'http://fanosity.images.tmp.s3.amazonaws.com/uploads',
    signingUrlQueryParams: {upload_type: 'avatar'}
};

const imagePaneStyle =  {
    height: 275,
    display: 'table-cell',
    verticalAlign: 'middle',
    textAlign: 'center',
    background: '#CCCCCC',
    marginBottom: 5,
    float: 'none'
};
const imageDisplayStyle = {
    display: 'inline-block'
};

class ImageUploaderProgress extends Component {
    render() {
        if (this.props.progress > 0) {
            return (
                <div className="text-center">
                    <h4>Uploading {this.props.progress}%</h4>
                </div>);
        } else if (this.props.error) {
            return (
                <div className="text-center">
                    <p class="bg-danger">{this.props.error}</p>
                </div>
            );
        } else {
            return (
                <div className="text-center">
                    <h4>
                        <span className="fa fa-image" /> Drop image here
                    </h4>
                    <p>-or-</p>
                    <p>
                        <a href="#" className="btn btn-primary">Select an image on your computer</a>
                    </p>
                </div>
            );
        }
    }
}

class ImageUploader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            imageEditStep: STEP_UPLOAD,
            jobId: ''
        };
        this.cropSettings = {};
    }

    componentWillMount() {
        if (!_.isEmpty(this.props.imageUrl)) {
            this.setState({imageEditStep: STEP_SHOW_IMAGE});
        }
    }

    handleFinishedUpload(result) {
        if (this.state.imageEditStep === STEP_UPLOAD) {
            this.setState({
                imageEditStep: STEP_CROP,
                uploadedImage: result.filename
            });
        }
    }


    handleCropComplete(crop) {
        this.cropSettings = crop;
    }

    handleCancelCrop() {
        this.setState({
            imageEditStep: STEP_UPLOAD,
            uploadedImage: ''
        });
    }

    handleCropSave() {
        const cropParams = {
            elementType: this.props.elementType,
            elementId: this.props.elementId,
            x: this.cropSettings.x,
            y: this.cropSettings.y,
            width: this.cropSettings.width,
            height: this.cropSettings.height,
            aspect: this.cropSettings.aspect,
            aspectRatio: `${this.props.aspectW}x${this.props.aspectH}`,
            s3FileKey: `uploads/${this.state.uploadedImage}`
        };
        this.props.sendCropRequest(cropParams)
            .then((data) => {
                if (data.error) {
                    this.setState({
                        imageEditStep: STEP_ERROR
                    });
                } else {
                    this.setState({
                        jobId: _.get(data, 'payload.data.jobId', ''),
                        imageEditStep: STEP_WAIT
                    });
                    setTimeout(() => {
                        this.checkIfProcessingIsDone();
                    }, 10000)
                }
            });
    }

    checkIfProcessingIsDone() {
        this.props.fetchStatusOfJobId(this.state.jobId)
            .then((result) => {
                const status = _.get(this.props.jobStatus, this.state.jobId, 'unknown');
                if (status === 'complete') {
                    this.props.onJobComplete();
                    this.setState({ imageEditStep: STEP_SHOW_IMAGE });
                } else {
                    setTimeout(() => {
                        this.checkIfProcessingIsDone();
                    }, 5000)
                }
            });
    }
    renderCropper() {
        const crop = {
            width: 30,
            aspect: this.props.aspectW / this.props.aspectH
        };

        if (this.state.imageEditStep === STEP_CROP) {
            return (
                <div>
                    <div>
                        <h4>Crop Image to {this.props.aspectW}:{this.props.aspectH}</h4>
                        <ReactCrop src={`${uploaderProps.s3Url}/${this.state.uploadedImage}`}
                                   onComplete={this.handleCropComplete.bind(this)}
                                   crop={crop} />
                        <div className="text-right">
                            <button onClick={this.handleCropSave.bind(this)} className="btn btn-primary">Save Image</button>
                            <button onClick={this.handleCancelCrop.bind(this)} className="btn btn-danger">Cancel</button>
                        </div>
                    </div>
                </div>)
        }
        return (<div></div>);
    }

    renderActionPane() {
        if (this.state.imageEditStep === STEP_UPLOAD) {
            return (
                <DropzoneS3Uploader onFinish={this.handleFinishedUpload.bind(this)} {...uploaderProps}>
                    <ImageUploaderProgress />
                </DropzoneS3Uploader>
            );
        } else {
            return (
                <div></div>
            );
        }
    }

    render() {
        switch (this.state.imageEditStep) {
            case STEP_SHOW_IMAGE:
                return (
                    <div style={imagePaneStyle}>
                        <div style={imageDisplayStyle}>
                            <img src={this.props.imageUrl} style={{width: '100%'}} />
                        </div>
                        <div className="text-center">
                            <p>
                                <a className="btn btn-primary" onClick={() => this.setState({imageEditStep: STEP_UPLOAD})}>
                                    Upload New Image
                                </a>
                            </p>
                        </div>
                    </div>
                );
            case STEP_WAIT:
                return (
                    <div className="text-center" style={{minHeight: 275}}>
                        <div style={{marginTop: 100}}>
                            <img src="/images/ajax-loader.gif" />
                            <p>Processing Image ..</p>
                        </div>
                    </div>
                );
            case STEP_ERROR:
                return (
                    <div className="bg-danger">
                        <h4>
                            Error Processing Image
                        </h4>
                        {this.renderActionPane()}
                    </div>
                );
            default:
                return (
                    <div>
                        <div style={cropperStyle}>
                            {this.renderCropper()}
                        </div>
                        {this.renderActionPane()}
                    </div>
                );
        }
    }
}

ImageUploader.defaultProps = {
    aspectW: 1,
    aspectH: 1,
    elementId: 'not-found',
    elementType: 'not-found'
};



function mapStateToProps(state) {
    return {
        cropRequestResults: state.cropRequestResults,
        jobStatus: state.jobStatus
    }
}

export default connect(mapStateToProps, { sendCropRequest, fetchStatusOfJobId })(ImageUploader)
