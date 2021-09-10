package com.lzctzk.address.util.date;
/**
 * @author luozhen
 * @date 2019/3/1 10:41
 * @version V1.0
 * @description
 */

import java.util.Arrays;
import java.util.List;

/**
 * com.lzctzk.address.pojo.building.controller
 *
 * @author luozhen
 * @version V1.0
 * @date 2019/3/1 10:41
 * @description
 */

public class CommonMethod {

    /**
     * 分割为字符串数组
     *
     * @param character
     * @param compare
     * @return
     * @author luozhen
     * @date 2019-3-12 9:16
     */
    public static String[] division(String character, String compare) {
        String[] result;
        if (!character.contains(compare)) {
            String[] cacheData = {character};
            result = cacheData;
        } else {
            result = character.split(compare);
            //result = StringUtils.split(character,compare);
        }
        return result;
    }

    /**
     * 分割为字符串List集合
     *
     * @param character
     * @param compare
     * @return
     * @author luozhen
     * @date 2019-3-12 9:17
     */
    public static List<String> divisionToList(String character, String compare) {
        String[] ids = CommonMethod.division(character, compare);
        List<String> idList = Arrays.asList(ids);
        return idList;
    }

}
