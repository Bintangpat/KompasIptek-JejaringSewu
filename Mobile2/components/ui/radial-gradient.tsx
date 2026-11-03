import React, { useId } from 'react'
import { View, ViewStyle, StyleProp } from 'react-native'
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg'

interface AmbientRadialGlowProps {
  size: number
  color?: string // Format HEX misalnya '#00F2A9'
  maxOpacity?: number
  style?: StyleProp<ViewStyle>
}

export function AmbientRadialGlow({
  size,
  color = '#00F2A9',
  maxOpacity = 0.2,
  style,
}: AmbientRadialGlowProps) {
  // useId memastikan id gradient unik jika komponen dipanggil lebih dari sekali
  const gradientId = useId()

  return (
    <View style={style} pointerEvents='none'>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Defs>
          <RadialGradient
            id={gradientId}
            cx='50%'
            cy='50%'
            rx='50%'
            ry='50%'
            fx='50%'
            fy='50%'
            gradientUnits='userSpaceOnUse'
          >
            {/* Titik pusat paling terang */}
            <Stop offset='0%' stopColor={color} stopOpacity={maxOpacity} />
            {/* Transisi tengah memudar */}
            <Stop
              offset='50%'
              stopColor={color}
              stopOpacity={maxOpacity * 0.35}
            />
            {/* Tepian luar benar-benar blur transparan (tanpa hard edge) */}
            <Stop offset='100%' stopColor={color} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Rect
          x='0'
          y='0'
          width={size}
          height={size}
          fill={`url(#${gradientId})`}
        />
      </Svg>
    </View>
  )
}
