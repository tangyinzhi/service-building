package com.lzctzk.address.util.String;

public class StringUtil {
    /**
     * 首字母大写
     *
     * @param srcStr
     * @return
     */
    public static String firstCharacterToUpper(String srcStr) {
        return srcStr.substring(0, 1).toUpperCase() + srcStr.substring(1);
    }

    /**
     * 替换字符串并让它的下一个字母为大写
     * 调用示例  replaceUnderlineAndfirstToUpper("ni_hao_abc", "_", "")
     *
     * @param srcStr
     * @param org
     * @param ob
     * @return
     */
    public static String replaceUnderlineAndfirstToUpper(String srcStr, String org, String ob) {
        String newString = "";
        int first = 0;
        while (srcStr.indexOf(org) != -1) {
            first = srcStr.indexOf(org);
            if (first != srcStr.length()) {
                newString = newString + srcStr.substring(0, first) + ob;
                srcStr = srcStr.substring(first + org.length(), srcStr.length());
                srcStr = firstCharacterToUpper(srcStr);
            }
        }
        newString = newString + srcStr;
        return newString;
    }

    static char[] seeds = {'1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i',
            'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E',
            'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'};


    /**
     * 生成八位资源菜单CODE
     *
     * @return
     */
    public static synchronized String randomResourceModeCode() {

        StringBuffer seed = new StringBuffer();
        for (int i = 0; i < 8; i++) {
            //生成一个62内的随机数
            Integer random = (int) (Math.random() * 62);
            seed.append(seeds[random]);
        }
        return seed.toString();
    }
}
