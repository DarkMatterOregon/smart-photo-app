import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { guardian } from 'Shared/AuthGuard';
import Theme from './components/Theme';
import styles from './loginStyles';


class Login extends Component {
    static defaultProps = {};

    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    state = {
        email: '',
        password: ''
    };

    onLogin = (e) => {
        e.preventDefault();
        const { email, password } = this.state;
        guardian.loginWithEmailAndPassword(email, password)
            .then((results) => {
                // TODO: Handle errors throw during login
                console.log('Success', results)
            });
    };

    render() {
        const { classes } = this.props;

        return (
            <Theme>
                <main className={classes.main}>
                    <Paper className={classes.paper}>
                        <Avatar className={classes.avatar}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <form className={classes.form}>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="email">Email Address</InputLabel>
                                <Input
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    onChange={(e) => this.setState({ email: e.target.value })}
                                    value={this.state.email}
                                />
                            </FormControl>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <Input
                                    name="password"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                    onChange={(e) => this.setState({ password: e.target.value })}
                                    value={this.state.password}
                                />
                            </FormControl>
                            <FormControlLabel
                                control={<Checkbox value="remember" color="primary" />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                color="primary"
                                className={classes.submit}
                                onClick={this.onLogin}
                            >
                                Sign in
                            </Button>
                        </form>
                    </Paper>
                </main>
            </Theme>
        );
    }
}

export default withStyles(styles)(Login);
