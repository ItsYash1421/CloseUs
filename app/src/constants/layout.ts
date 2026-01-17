// Tab bar height constant for content spacing
export const TAB_BAR_HEIGHT = 70;
export const BOTTOM_CONTENT_INSET = 100; // Extra space for content to scroll above tab bar

/**
 * Use this constant in your ScrollView or FlatList components:
 * 
 * For ScrollView:
 * <ScrollView 
 *   contentContainerStyle={{ paddingBottom: BOTTOM_CONTENT_INSET }}
 * >
 *   {content}
 * </ScrollView>
 * 
 * For FlatList:
 * <FlatList
 *   contentContainerStyle={{ paddingBottom: BOTTOM_CONTENT_INSET }}
 *   data={data}
 *   renderItem={renderItem}
 * />
 * 
 * For regular View (if not scrollable):
 * <View style={{ paddingBottom: BOTTOM_CONTENT_INSET }}>
 *   {content}
 * </View>
 */
