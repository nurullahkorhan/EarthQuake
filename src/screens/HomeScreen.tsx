import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, View, StatusBar, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { EarthQuake } from '../types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const HomeScreen = () => {
	const [quakes, setQuakes] = useState<EarthQuake[]>([]);
	const [m, setM] = useState(0);

	const insets = useSafeAreaInsets();

	const getData = useCallback(async () => {
		const response = await axios.post(`https://deprem.afad.gov.tr/latestCatalogsList?m=${m}&utc=0&lastDay=30`);
		const data = response.data as EarthQuake[];
		setQuakes(data);
	}, [m]);

	useEffect(() => {
		getData();
	}, [getData]);

	return (
		<View style={[styles.container, { paddingTop: insets.top }]}>
			<StatusBar backgroundColor={'#14213d'} barStyle={'light-content'} />
			<View style={styles.titleContainer}>
				<Text style={styles.titleText}>SON DEPREMLER</Text>
				<View style={styles.filterArea}>
					<TextInput
						placeholder={'0'}
						placeholderTextColor={'#000'}
						style={styles.input}
						keyboardType="numeric"
						onChangeText={(text) => setM(Number(text))}
					/>
					<TouchableOpacity
						activeOpacity={0.7}
						style={styles.button}
						onPress={() => {
							if (m >= 0) {
								getData();
							}
						}}
					>
						<Text style={styles.buttonText}>Filtrele</Text>
					</TouchableOpacity>
				</View>
			</View>
			<FlatList
				data={quakes}
				contentContainerStyle={styles.content}
				refreshing={false}
				onRefresh={() => getData()}
				keyExtractor={(item) => item.time}
				renderItem={({ item }) => {
					let area = item.city + ' / ' + item.district;
					if (item.city === '-') {
						area = item.other.split(',')[0];
					}
					return (
						<View style={styles.quakeList}>
							<View style={styles.leftContainer}>
								<Text style={styles.areaText}>{area}</Text>
								<Text style={styles.timeText}>{item.time}</Text>
							</View>
							<View style={styles.rightContainer}>
								<Text style={styles.m}>{item.m}</Text>
							</View>
						</View>
					);
				}}
			/>
		</View>
	);
};

export default HomeScreen;

const styles = StyleSheet.create({
	input: {
		backgroundColor: '#f1faee',
		borderRadius: 10,
		width: 40,
		height: 35,
		marginRight: 10,
		textAlign: 'center',
		color: '#14213d',
		fontSize: 16,
		padding: 0,
	},
	leftContainer: {
		marginLeft: 10,
	},
	button: {
		backgroundColor: '#f1faee',
		width: 75,
		height: 35,
		borderRadius: 10,
		alignItems: 'center',
		justifyContent: 'center',
	},
	buttonText: {
		color: '#14213d',
		fontSize: 16,
	},
	filterArea: {
		flexDirection: 'row',
	},
	container: {
		flex: 1,
		backgroundColor: '#14213d',
	},
	rightContainer: {
		backgroundColor: '#9d0208',
		alignItems: 'center',
		justifyContent: 'center',
		marginRight: 10,
		width: 60,
		height: 45,
		borderRadius: 10,
	},
	content: {
		paddingHorizontal: 20,
	},
	quakeList: {
		flexDirection: 'row',
		height: 60,
		marginBottom: 5,
		alignItems: 'center',
		justifyContent: 'space-between',
		backgroundColor: '#343a40',
		borderRadius: 5,
		borderColor: '#000',
		borderWidth: 1,
	},
	titleContainer: {
		marginVertical: 20,
		paddingHorizontal: 20,
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	titleText: {
		fontSize: 20,
		color: '#f1faee',
	},
	areaText: {
		fontSize: 20,
		color: '#f1faee',
	},
	timeText: {
		fontSize: 14,
		color: '#f1faee',
	},
	m: {
		fontSize: 20,
		color: '#f1faee',
	},
});
