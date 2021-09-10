package com.lzctzk.address.util.jackson;

import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.*;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Map;

/**
 * <b>Description:</b> json转换工具类<br>
 *
 * @author luozhen
 * @version 1.0
 * @Note <b>ProjectName:</b> appEdit <br>
 * <b>PackageName:</b> com.ctzk.utils.jackson <br>
 * <b>ClassName:</b> JsonUtil <br>
 * <b>Date:</b> 2018年6月21日 上午10:44:17
 */
public class JsonUtil {

    private static final Logger log = LoggerFactory.getLogger(JsonUtil.class);

    /**
     * ObjectMapper是JSON操作的核心，Jackson的所有JSON操作都是在ObjectMapper中实现。
     * ObjectMapper有多个JSON序列化的方法，可以把JSON字符串保存File、OutputStream等不同的介质中。
     * writeValue(File arg0, Object arg1)把arg1转成json序列，并保存到arg0文件中。
     * writeValue(OutputStream arg0, Object arg1)把arg1转成json序列，并保存到arg0输出流中。
     * writeValueAsBytes(Object arg0)把arg0转成json序列，并把结果输出成字节数组。
     * writeValueAsString(Object arg0)把arg0转成json序列，并把结果输出成字符串。
     */

    /**
     * 初始化变量
     */
    private static final ObjectMapper mapper = new ObjectMapper();

    static {
        // 解决实体未包含字段反序列化时抛出异常
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        // 对于空的对象转json的时候不抛出错误
        mapper.disable(SerializationFeature.FAIL_ON_EMPTY_BEANS);

        // 允许属性名称没有引号
        mapper.configure(Feature.ALLOW_UNQUOTED_FIELD_NAMES, true);

        // 允许单引号
        mapper.configure(Feature.ALLOW_SINGLE_QUOTES, true);

        // 允许出现特殊字符和转义符
        mapper.configure(Feature.ALLOW_UNQUOTED_CONTROL_CHARS, true);

        // 忽略无法转换的对象 “No serializer found for class com.xxx.xxx”
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, true);

        //反序列化时忽略在JSON字符串中存在，而在Java中不存在的属性
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

        //java时间格式反序列化
        mapper.configure(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS, false);
        mapper.registerModule(new JavaTimeModule());
    }

    /**
     * <b>Description:</b> 将一个object转换为json, 可以使一个java对象，也可以使集合<br>
     * <b>Title:</b> ObjectToJson<br>
     *
     * @param obj - 传入的数据
     * @return
     * @Note <b>Author:</b> luozhen <br>
     * <b>Date:</b> 2018年5月24日 下午1:26:53 <br>
     * <b>Version:</b> 1.0
     */
    public static String objectToJson(Object obj) {
        //log.info("进入工具类:JsonUtil==>objectToJson:开始进行数据转换");
        String json = null;
        try {
            json = mapper.writeValueAsString(obj);
            //log.info("进入工具类:JsonUtil==>objectToJson:数据转换成功");
            //log.info("转换后数据:" + json);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("进入工具类:JsonUtil==>objectToJson:数据转换错误");
        }
        return json;
    }

    /**
     * ObjectMapper支持从byte[]、File、InputStream、字符串等数据的JSON反序列化。
     */

    /**
     * <b>Description:</b> 将json结果集转化为对象<br>
     * <b>Title:</b> jsonToClass<br>
     *
     * @param json     - json数据
     * @param beanType - 转换的实体类型
     * @return
     * @Note <b>Author:</b> luozhen <br>
     * <b>Date:</b> 2018年5月24日 下午3:26:18 <br>
     * <b>Version:</b> 1.0
     */
    public static <T> T jsonToClass(String json, Class<T> beanType) {
        //log.info("进入工具类:JsonUtil==>jsonToClass:开始进行数据转换");
        T t = null;
        try {
            t = mapper.readValue(json, beanType);
            //log.info("进入工具类:JsonUtil==>jsonToClass:数据转换成功");
            //log.info("转换后数据:" + t);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("进入工具类:JsonUtil==>jsonToClass:数据转换错误");
        }
        return t;
    }

    /**
     * <b>Description:</b> 将json数据转换成Map<br>
     * <b>Title:</b> jsonToMap<br>
     *
     * @param json - 转换的数据
     * @return
     * @Note <b>Author:</b> luozhen <br>
     * <b>Date:</b> 2018年5月24日 下午3:29:37 <br>
     * <b>Version:</b> 1.0
     */
    public static Map<String, Object> jsonToMap(String json) {
        //log.info("进入工具类:JsonUtil==>jsonToMap:开始进行数据转换");
        Map<String, Object> map = null;
        try {
            map = mapper.readValue(json, new TypeReference<Map<String, Object>>() {
            });
            //log.info("进入工具类:JsonUtil==>jsonToMap:数据转换成功");
            //log.info("转换后数据:" + map);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("进入工具类:JsonUtil==>jsonToMap:数据转换错误");
        }
        return map;
    }

    /**
     * <b>Description:</b> 将json数据转换成list <br>
     * <b>Title:</b> jsonToList<br>
     *
     * @param <T>
     * @param json - 转换的数据
     * @return
     * @Note <b>Author:</b> luozhen <br>
     * <b>Date:</b> 2018年5月24日 下午3:28:35 <br>
     * <b>Version:</b> 1.0
     */
    public static <T> List<T> jsonToList(String json, Class<T> beanType) {
        //log.info("进入工具类:JsonUtil==>jsonToList:开始进行数据转换");
        List<T> list = null;
        try {
            JavaType javaType = mapper.getTypeFactory().constructParametricType(List.class, beanType);
            list = mapper.readValue(json, javaType);
            //log.info("进入工具类:JsonUtil==>jsonToList:数据转换成功");
            //log.info("转换后数据:" + list);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("进入工具类:JsonUtil==>jsonToList:数据转换错误");
        }
        return list;
    }

    /**
     * <b>Description:</b> 获取json对象数据的属性<br>
     * <b>Title:</b> findValue<br>
     *
     * @param resData - 请求的数据
     * @param resPro  - 请求的属性
     * @return 返回String类型数据
     * @Note <b>Author:</b> luozhen <br>
     * <b>Date:</b> 2018年5月31日 上午10:00:09 <br>
     * <b>Version:</b> 1.0
     */
    public static String findValue(String resData, String resPro) {
        //log.info("进入工具类:JsonUtil==>findValue:开始进行数据获取");
        String result = null;
        try {
            JsonNode node = mapper.readTree(resData);
            JsonNode resProNode = node.findValue(resPro);
            // 第一种方法
            if (resProNode.isTextual()) {
                result = resProNode.textValue();
            } else {
                result = JsonUtil.objectToJson(resProNode);
            }
            // 第二种方法
            /*
             * if(resProNode.isValueNode()) { result = resProNode.asText(); } else { result
             * = JsonUtil.objectToJson(resProNode); }
             */
            //log.info("进入工具类:JsonUtil==>findValue:数据获取成功");
            //log.info("转换后数据:" + result);
        } catch (Exception e) {
            e.printStackTrace();
            log.error("进入工具类:JsonUtil==>findValue:数据获取错误");
        }
        return result;
    }

    /**
     * 返回格式化JSON字符串。
     *
     * @param json 未格式化的JSON字符串。
     * @return 格式化的JSON字符串。
     */
    public static String formatJson(String json) {
        StringBuffer result = new StringBuffer();

        int length = json.length();
        int number = 0;
        char key = 0;

        // 遍历输入字符串。
        for (int i = 0; i < length; i++) {
            // 1、获取当前字符。
            key = json.charAt(i);

            // 2、如果当前字符是前方括号、前花括号做如下处理：
            if ((key == '[') || (key == '{')) {
                // （1）如果前面还有字符，并且字符为“：”，打印：换行和缩进字符字符串。
                if ((i - 1 > 0) && (json.charAt(i - 1) == ':')) {
                    result.append('\n');
                    result.append(indent(number));
                }

                // （2）打印：当前字符。
                result.append(key);

                // （3）前方括号、前花括号，的后面必须换行。打印：换行。
                result.append('\n');

                // （4）每出现一次前方括号、前花括号；缩进次数增加一次。打印：新行缩进。
                number++;
                result.append(indent(number));

                // （5）进行下一次循环。
                continue;
            }

            // 3、如果当前字符是后方括号、后花括号做如下处理：
            if ((key == ']') || (key == '}')) {
                // （1）后方括号、后花括号，的前面必须换行。打印：换行。
                result.append('\n');

                // （2）每出现一次后方括号、后花括号；缩进次数减少一次。打印：缩进。
                number--;
                result.append(indent(number));

                // （3）打印：当前字符。
                result.append(key);

                // （4）如果当前字符后面还有字符，并且字符不为“，”，打印：换行。
                if (((i + 1) < length) && (json.charAt(i + 1) != ',')) {
                    result.append('\n');
                }

                // （5）继续下一次循环。
                continue;
            }

            // 4、如果当前字符是逗号。逗号后面换行，并缩进，不改变缩进次数。
            if ((key == ',')) {
                result.append(key);
                result.append('\n');
                result.append(indent(number));
                continue;
            }

            // 5、打印：当前字符。
            result.append(key);
        }

        return result.toString();
    }

    /**
     * 单位缩进字符串。
     */
    private static String SPACE = "   ";

    /**
     * 返回指定次数的缩进字符串。每一次缩进三个空格，即SPACE。
     *
     * @param number 缩进次数。
     * @return 指定缩进次数的字符串。
     */
    private static String indent(int number) {
        StringBuffer result = new StringBuffer();
        for (int i = 0; i < number; i++) {
            result.append(SPACE);
        }
        return result.toString();
    }
}
