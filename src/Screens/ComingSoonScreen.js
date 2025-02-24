import React from "react";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";
import { StyleSheet } from "react-native";
import { Icon } from "react-native-elements";
import twelve from '../../src/assets/net/bw.jpg';
import dav from '../../src/assets/net/cr.jpg';
import wiz from '../../src/assets/net/di.jpg';
import man from '../../src/assets/net/gh.jpg';
import won from '../../src/assets/net/jc.jpg';
import cod from '../../src/assets/net/pl.jpg';
import hod from '../../src/assets/net/sc.jpg';

export default function ComingScreen() {
    return (
        <View style={styles.container}>
            <ScrollView style={styles.scroller}>
                <View style={styles.scrollWrapper}>
                    <View style={styles.header}>
                        <View style={styles.headContent}>
                            <View style={styles.textHolder}>
                                <Text style={styles.headText}>Coming Soon</Text>
                            </View>
                            <View style={styles.headBtnHolder}>
                                <TouchableOpacity>
                                    <Icon
                                        type="entypo"
                                        color={'white'}
                                        size={25}
                                        name={'user'}
                                        style={styles.headLogo}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>

                    {/* Static Show 1 */}
                    <View style={styles.showContainer}>
                        <Image source={dav} style={styles.showImage} />
                        <Text style={styles.showName}>Creed</Text>
                        <Text style={styles.showRel}>New movie coming on Friday</Text>
                        <Text style={styles.showBio}>
                            Amateur boxer Adonis Creed (Jordan) is trained and mentored by Rocky Balboa (Stallone), the former rival turned friend of Adonis' father, Apollo Creed.
                        </Text>
                    </View>

                    {/* Static Show 2 */}
                    <View style={styles.showContainer}>
                        <Image source={wiz} style={styles.showImage} />
                        <Text style={styles.showName}>Divergent</Text>
                        <Text style={styles.showRel}>New movie coming on 12 of November</Text>
                        <Text style={styles.showBio}>
                            In a world divided by factions based on virtues, Tris learns she’s Divergent and won’t fit in. When she discovers a plot to destroy Divergents, Tris and the mysterious Four must find out what makes Divergents dangerous before it's too late.
                        </Text>
                    </View>

                    {/* Static Show 3 */}
                    <View style={styles.showContainer}>
                        <Image source={man} style={styles.showImage} />
                        <Text style={styles.showName}>Ghosted</Text>
                        <Text style={styles.showRel}>New movie coming on 1st of November</Text>
                        <Text style={styles.showBio}>
                            At a Washington, D.C. farmers market, lonely Sadie Rhodes meets Cole Turner, a romantically needy vendor. They share an enjoyable all-night date, culminating in sex, and Cole returns home but his texts to Sadie go unanswered.
                        </Text>
                    </View>

                    {/* Static Show 4 */}
                    <View style={styles.showContainer}>
                        <Image source={won} style={styles.showImage} />
                        <Text style={styles.showName}>Vanguard</Text>
                        <Text style={styles.showRel}>New movie coming on 3 of December</Text>
                        <Text style={styles.showBio}>
                            Covert security company Vanguard is the last hope of survival for an accountant after he is targeted by the world’s deadliest mercenary organization.
                        </Text>
                    </View>

                    {/* Static Show 5 */}
                    <View style={styles.showContainer}>
                        <Image source={cod} style={styles.showImage} />
                        <Text style={styles.showName}>Plane</Text>
                        <Text style={styles.showRel}>New movie coming on 17 of December</Text>
                        <Text style={styles.showBio}>
                            The story follows Captain Brodie Torrance (Gerard Butler) flying his crew and passengers on an airplane with a dangerous criminal, Louis Gaspare (Mike Colter) on board.
                        </Text>
                    </View>

                    {/* Static Show 6 */}
                    <View style={styles.showContainer}>
                        <Image source={hod} style={styles.showImage} />
                        <Text style={styles.showName}>Skyscraper</Text>
                        <Text style={styles.showRel}>New movie coming on 25 of December</Text>
                        <Text style={styles.showBio}>
                            Will Sawyer, a former FBI agent, must rescue his family from a newly built Hong Kong skyscraper, the tallest in the world, after terrorists set the building on fire in an attempt to extort the property developer.
                        </Text>
                    </View>

                    {/* Static Show 7 */}
                    <View style={styles.showContainer}>
                        <Image source={twelve} style={styles.showImage} />
                        <Text style={styles.showName}>Black Widow</Text>
                        <Text style={styles.showRel}>Season 1 coming on 12 July</Text>
                        <Text style={styles.showBio}>
                            Set after the events of Captain America: Civil War (2016), the film sees Romanoff on the run and forced to confront her past as a Russian spy before she became an Avenger.
                        </Text>
                    </View>

                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    scroller: {
        width: '99%',
        backgroundColor: 'black',
    },
    scrollWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        width: '100%',
        alignItems: 'center',
        marginTop: 30,
        height: 50,
    },
    headContent: {
        flexDirection:'row',
        justifyContent:'center',
        alignItems:'center',
        paddingVertical:10,
        width:'90%',
    },
    textHolder: {
        alignItems: 'center',
        flex: 1,
    },
    headText: {
        fontSize: 24,
        color: 'white',
        fontWeight: 'bold',
        marginRight:50,
    },
    headBtnHolder: {
        flexDirection: 'row-reverse',
        flex: 1,
        alignItems: 'center',
        position:'relative',
        right:-20,
    },
    headLogo: {
        paddingHorizontal: 30,
    },
    showContainer: {
        width: '90%',
        marginBottom: 20,
        backgroundColor: '#222',
        borderRadius: 8,
        padding: 10,
        marginTop: 15,
    },
    showImage: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
    showName: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        marginVertical: 10,
    },
    showRel: {
        fontSize: 16,
        color: 'gray',
    },
    showBio: {
        fontSize: 14,
        color: 'white',
        marginTop: 10,
    },
});
