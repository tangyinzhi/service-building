package com.lzctzk.address.pojo.building.servcie;
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
     * 功能描述: 分割为字符串数组
     *
     * @param
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
        }
        return result;
    }

    /**
     * 功能描述: 分割为字符串List集合
     *
     * @param
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
