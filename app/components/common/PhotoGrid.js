import React, { Component } from 'react';
import { Dimensions, FlatList, StyleSheet, View, } from 'react-native';
import PropTypes from 'prop-types';

export default class PhotoGrid extends Component {
    static propTypes = {
        data: PropTypes.array,
        itemsPerRow: PropTypes.number,
        itemPaddingHorizontal: PropTypes.number,
        renderItem: PropTypes.func
    };

    renderRow = ({ item: itemArray = [] }) => {
        const { itemsPerRow, itemMargin, itemPaddingHorizontal, renderItem } = this.props;

        const deviceWidth = Dimensions.get('window').width;
        const margin = itemMargin || 1;

        const totalMargin = margin * (itemsPerRow - 1);
        const itemWidth = Math.floor( (deviceWidth) / itemsPerRow );
        const adjustedMargin = itemPaddingHorizontal * 2;

        return (
            <View style={[styles.row, { marginBottom: adjustedMargin }]}>
                {itemArray.map(item => renderItem(item, itemWidth, itemPaddingHorizontal))}
                {itemsPerRow - itemArray.length > 0 && <View style={{ width: itemWidth * (itemsPerRow - itemArray.length)}} />}
            </View>
        );
    };

    buildRows(items, itemsPerRow = 3) {
        return items.reduce((rows, item, idx) => {
            // If a full row is filled create a new row array
            if (idx % itemsPerRow === 0 && idx > 0) {
                rows.push([]);
            }

            rows[rows.length-1].push(item);
            return rows;
        }, [[]]);
    }

    render() {
        let rows = this.buildRows(this.props.data, this.props.itemsPerRow);

        return (
            <FlatList
                {...this.props}
                style={{flex: 1}}
                data={rows}
                renderItem={this.renderRow}
                keyExtractor={(itemArray) =>  itemArray.reduce((k, item) => `${k}_${item.id}`, '')}
            />
        );
    }
}

const styles = StyleSheet.create({
    row: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        marginBottom: 20
    }
});

