import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PhotoAlbum from '@material-ui/icons/PhotoLibrary';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
import OriginalImageCard from './OriginalImageCard';
import ImageCard from './ImageCard';

import { ORIGINAL } from './imageTypes';

const styles = theme => ({
    root: {
        display: 'flex',
    },
    content: {
        flexGrow: 1,
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        backgroundColor: theme.palette.background.default,
        padding: theme.spacing.unit * 3,
        minHeight: 350
    },
    menuItem: {
        '&:focus': {
            backgroundColor: theme.palette.primary.main,
            '& $primary, & $icon': {
                color: theme.palette.common.white,
            },
        },
    },
    primary: {},
    icon: {}
});

class ImageAlbumBrowser extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired,
        albums: PropTypes.array.isRequired
    };

    constructor(props) {
        super(props);
        this.state = {
            currentAlbum: props.albums.length > 0 ? props.albums[0] : ''
        };
    }

    setCurrentAlbum = (album) => () => this.setState({ currentAlbum: album });

    renderAlbumMenu() {
        const { currentAlbum } = this.state;
        const { classes, albums } = this.props;

        return (
            <MenuList>
                {albums.map((album) => (
                    <MenuItem
                        className={classes.menuItem} key={album.name}
                        selected={currentAlbum.name === album.name}
                        onClick={this.setCurrentAlbum(album)}
                        key={album.name}
                    >
                        <ListItemIcon className={classes.icon}>
                            <PhotoAlbum/>
                        </ListItemIcon>
                        <ListItemText classes={{ primary: classes.primary }} inset primary={album.name}/>
                    </MenuItem>
                ))}
            </MenuList>
        );
    }

    renderImages(type) {
        const { currentAlbum } = this.state;
        const { sourceImages, processedImages } = currentAlbum;

        if (type === ORIGINAL && sourceImages) {
            return sourceImages.map((image, i) => <OriginalImageCard image={image} key={`original-image-${i}`}/>);
        } else if (processedImages) {
            const imagesMatchingAspectRatio = processedImages.filter(
                (image) => image && image.aspectRatio && image.aspectRatio.toLowerCase() === type.toLowerCase().replace('aspect_', '')
            );
            console.log('processedImages', processedImages);
            console.log('type', type);
            console.log('imagesMatchingAspectRatio', imagesMatchingAspectRatio);
            return imagesMatchingAspectRatio.map((image, i) => <ImageCard image={image} key={`processed-${type}-${i}`} />);
        }

        return (
            <div>NO IMAGES</div>
        );

    }

    render() {
        const { classes, type } = this.props;

        return (
            <div className={classes.root}>
                {this.renderAlbumMenu()}
                <main className={classes.content}>
                    {this.renderImages(type)}
                </main>
            </div>
        );
    }
}

export default withStyles(styles)(ImageAlbumBrowser);
