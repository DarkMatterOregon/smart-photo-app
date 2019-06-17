import React, {Component} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core';
import ImageAlbumBrowser from './ImageAlbumBrowser';
import { ORIGINAL, ASPECT_1X1, ASPECT_5X2, ASPECT_16X9 } from './imageTypes';

const imageFileFormat = /^([0-9][0-9]*x[0-9][0-9]*\-w)([0-9][0-9]*)(\.png)$/;
const maxImageDisplay = 200;

const TABS = [
    {
        label: 'Original',
        value: ORIGINAL
    },
    {
        label: '1x1',
        value: ASPECT_1X1
    },
    {
        label: '5x2',
        value: ASPECT_5X2
    },
    {
        label: '16x9',
        value: ASPECT_16X9
    },
];

const imageListStyle =  {
    display: 'table-cell',
    marginTop: '10',
    float: 'none'
};


const styles = theme => ({
    root: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginTop: 20,
        padding: 10,
        border: `solid 1px ${theme.palette.divider}`
    }
});

class ImageManager extends Component {
    static defaultProps = {
        elementId: '',
        elementType: '',
        onJobComplete: () => { console.log('onJobComplete method not provided' )}
    };

    static propTypes = {
        classes: PropTypes.object.isRequired,
        sourceImageAlbums: PropTypes.array
    };

    state = {
        uploadMode: {},
        activeTab: ORIGINAL
    };

    handleChange = (event, activeTab) => {
        this.setState({ activeTab });
    };

    toggle(tabName) {
        if (this.state.activeTab !== tabName) {
            this.setState({
                activeTab: tabName
            });
        }
    }

    renderTab(content) {
        const { classes } = this.props;
        return (
            <Typography component="div">
                {content}
            </Typography>
        );
    }

    renderTabs() {
        const { classes } = this.props;
        const { activeTab } = this.state;

        return (
            <Tabs value={activeTab} onChange={this.handleChange}>
                {TABS.map(({ label, value }) => <Tab label={label} value={value} key={value} /> )}
            </Tabs>
        )
    }

    renderContent() {
        const { classes, sourceImageAlbums } = this.props;
        const { activeTab } = this.state;

        const currentTab = TABS.find((tab) => tab.value === activeTab);

        if (!currentTab) {
            return <div/>;
        }

        return (
            <ImageAlbumBrowser albums={sourceImageAlbums} type={currentTab.value} />
        )
    }

    render() {
        const { classes } = this.props;
        const { activeTab } = this.state;

        return (
            <div className={classes.root}>
                <Typography variant="subtitle1">
                    Image Libraries
                </Typography>
                {this.renderTabs()}
                {this.renderContent()}
            </div>
        );
    }
}

export default withStyles(styles)(ImageManager);
