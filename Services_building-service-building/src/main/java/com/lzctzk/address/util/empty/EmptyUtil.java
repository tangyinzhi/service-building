/**
 * All rights Reserved, Designed By www.lzctzk.com
 *
 * @title ObjectUtils.java
 * @Package com.ctzk.utils
 * @descriptionTODO
 * @author: luozhen
 * @date 2018年7月18日 上午8:50:44
 * @version V1.0
 * @Copyright: 2018 www.lzctzk.com Inc. All rights reserved.
 * 注意：本内容仅限于[泸州市城投智慧科技发展有限责任公司]内部传阅，禁止外泄以及用于其他的商业目
 */
package com.lzctzk.address.util.empty;

import java.lang.reflect.Array;
import java.util.Collection;
import java.util.Map;

/**
 * <b>Description:</b> 判断对象是否为空或null<br>
 *
 * @author luozhen
 * @version 1.0
 * @Note <b>ProjectName:</b> appEdit <br>
 *       <b>PackageName:</b> com.ctzk.utils <br>
 *       <b>ClassName:</b> ObjectUtils <br>
 *       <b>Date:</b> 2018年7月18日 上午8:50:44
 */

public final class EmptyUtil {
    public static boolean isEmpty(Object obj) {
        if (obj == null) {
            return true;
        } else if (obj instanceof CharSequence) {
            // 判断字符串长度为0，即等于""，空字符串。
            return ((CharSequence) obj).length() == 0;
        } else if (obj.getClass().isArray()) {
            return Array.getLength(obj) == 0;
        } else if (obj instanceof Collection) {
            return ((Collection<?>) obj).isEmpty();
        } else if (obj instanceof Map) {
            return ((Map<?, ?>) obj).isEmpty();
        }
        return false;
    }

    public static boolean isNotEmpty(Object obj) {
        return !isEmpty(obj);
    }

}