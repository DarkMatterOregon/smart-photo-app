import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import List from '@material-ui/core/List';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import { AdminContext } from '../../Admin';
import { Query } from 'react-apollo';
import { voteSummaryReport } from 'Shared/queries/reports';
import CircularProgress from '@material-ui/core/CircularProgress';

const styles = (theme) => ({
    root: {
        width: '100%'
    },
    heading: {
        fontSize: theme.typography.pxToRem(15),
        flexBasis: '33.33%',
        flexShrink: 0
    },
    secondaryHeading: {
        fontSize: theme.typography.pxToRem(15),
        color: theme.palette.text.secondary
    },
    awardDetails: {
        fontSize: theme.typography.pxToRem(12),
        color: theme.palette.text.secondary
    },
    avatar: {
        margin: 10,
    },
    bigAvatar: {
        margin: 10,
        width: 60,
        height: 60,
    }
});

class Reports extends Component {
    state = {
        expanded: ''
    };

    handleChange = (panel) => (event, isExpanded) => {
        this.setState({
            expanded: isExpanded ? panel : false
        });
    };

    renderDetailRow(detail, awardId) {
        const { classes } = this.props;
        const { element: { name, primaryImage }, elementId, voteCount } = detail;

        console.log(detail);
        return (
            <ListItem key={`${awardId}-${elementId}`}>
                <ListItemAvatar>
                    <Avatar alt={name} src={primaryImage.url} className={classes.bigAvatar} />
                </ListItemAvatar>
                <ListItemText primary={name} secondary={`${voteCount} Vote${voteCount !== 1 ? 's' : ''}`} />
            </ListItem>
        );
    }

    renderDetails(details, awardId) {
        const { classes } = this.props;

        return (
            <List className={classes.root}>
                {details.map((detail) => this.renderDetailRow(detail, awardId))}
            </List>
        );
    }

    renderPanel(award) {
        const { expanded } = this.state;
        const { classes } = this.props;
        const { awardId, award: { name, awardCategories, description }, details } = award;

        const totalVotes = details.reduce((tot, detail) => tot + detail.voteCount, 0);
        const maxVote = details.reduce((max, detail) => detail.voteCount > max ? detail.voteCount : max, 0);

        const winners = details
            .filter((detail) => detail.voteCount === maxVote)
            .map((detail) => detail.element.name);


        return (
            <ExpansionPanel expanded={expanded === awardId} onChange={this.handleChange(awardId)} key={awardId}>
                <ExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    aria-controls={`${awardId}bh-content`}
                    id={`${awardId}bh-header`}
                >
                    <Typography className={classes.heading}>{`${name} (${awardCategories.join(',')})`}</Typography>
                    <Typography className={classes.secondaryHeading}>
                        Total Votes: {totalVotes} (max: {maxVote})<br />
                        {winners.join(', ')}
                    </Typography>
                </ExpansionPanelSummary>
                <ExpansionPanelDetails>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Typography className={classes.awardDetails}>
                                {description}
                            </Typography>
                        </Grid>
                        <Grid item xs={12}>
                            {this.renderDetails(details, awardId)}
                        </Grid>
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        )
    }

    renderVoteSummary(eventId) {
        const { classes } = this.props;

        return (
            <div className={classes.root}>
                <Query query={voteSummaryReport} variables={{ eventId }} >
                    {({ loading, error, data }) => {
                        if (loading) {
                            return <CircularProgress className={classes.progress} />;
                        }
                        if (error) {
                            return `Error!: ${error}`;
                        }
                        return data.summary.map((award) => this.renderPanel(award));
                    }}
                </Query>
            </div>
        );
    }

    render() {
        return (
            <AdminContext.Consumer>
                {(context) => this.renderVoteSummary(context.currentEventId)}
            </AdminContext.Consumer>
        );
    }
}

export default withStyles(styles)(Reports);
