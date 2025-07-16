import { images } from '@/constants/images'
import MaskedView from '@react-native-masked-view/masked-view'
import { Link } from 'expo-router'
import React from 'react'
import { Image, Text, TouchableOpacity, View } from 'react-native'

const TrendingCard = ({movie: {movie_id, title, poster_url}, index}: TrendingCardProps) => {
  return (
    <Link href={`/movies/${movie_id}`} asChild>
        <TouchableOpacity className='w-32 relative pl-5'>
            <Image
                source={{uri: poster_url 
                    ? `https://image.tmdb.org/t/p/w500${poster_url}`
                    : 'https://placehold.co/600x400/1a1a1a/ffffff.png'}}
                className="w-32 h-48 rounded-lg"
                resizeMode="cover"
            />

            <View className="absolute bottom-11 -left-3.5 px-2 py-1 rounded-full">

                <MaskedView 
                    maskElement={
                        <Text className="font-bold text-white text-5xl">{index + 1}</Text>
                    }
                >
                    <Image 
                        source={images.rankingGradient} 
                        className="size-14" 
                        resizeMode="cover"
                    />
                </MaskedView>
                
            </View>

            <Text className="text-sm font-bold mt-2 text-light-200" numberOfLines={2}>
                {title}
            </Text>

        </TouchableOpacity>
    </Link>
  )
}

export default TrendingCard