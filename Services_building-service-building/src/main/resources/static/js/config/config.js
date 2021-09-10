var systemid = "5CC0556BAD2345E0A131DFA37002BDEB";
var xiangmuUrl = "http://localhost:8893";
//var dataManagerIP = "http://localhost:29991";
var dataManagerIP = "http://172.1.4.162/dataManager";
//var BUILDURL = "http://192.168.124.22:8893";
//var BUILDURL = "http://localhost:8893";
// var BUILDURL = "http://192.168.1.3:8893";
var BUILDURL = "http://localhost:8893";
//var BUILDURL = "http://192.168.30.55:8080/building";
//var BUILDURL = "http://192.168.30.26:8893";
//日志查询url
var logSelectByPageUrl = BUILDURL + "/Log/GetByDynamicWithPage";
//日志统计url
var logTolCountUrl = BUILDURL + "/Log/GetTolCount";

//日志添加url
var logAddUrl = BUILDURL + "/Log/addLog";

//获取所有得到系统url
var getAllSystemUrl = BUILDURL + "/System/getAll";
//获取系统树
var getSystemTree = BUILDURL + "/System/GetSystemTree";
//新增系统url
var addSystemUrl = BUILDURL + "/System/InsertSystem";
//更新系统url
var editSystemUrl = BUILDURL + "/System/UpdateSystem";
//删除系统url
var delSystemUrl = BUILDURL + "/System/DeleteSystem";
//根据ID查询系统限url
var selectSystemByIdUrl = BUILDURL + "/System/GetBySystemID";
//批量删除系统url
var delBatchSystemUrl = BUILDURL + "/System/BatchDeleteSystem";
//动态查询系统url（分页）
var selectSystemByPageUrl = BUILDURL + "/System/GetByDynamicWithPage";
//检查系统名是否重复
var CheckSystemName = BUILDURL + "/System/CheckName";

//新增权限url
var addPermissionUrl = BUILDURL + "/Permission/InsertPermission";
//更新权限url
var editPermissionUrl = BUILDURL + "/Permission/UpdatePermission";
//删除权限url
var delPermissionUrl = BUILDURL + "/Permission/DeletePermission";
//根据ID查询权限url
var selectPermissionByIdUrl = BUILDURL + "/Permission/GetByID";
//批量删除权限url
var delBatchPermissionUrl = BUILDURL + "/Permission/BatchDeletePermission";
//动态查询权限url（分页）
var selectPermissionByPageUrl = BUILDURL + "/Permission/GetByDynamic";
//获取权限树的pid
var selectPermissionTreeSpid = BUILDURL + "/Permission/GetTreeSpid";
//获取权限父级权限
var selectPermissionParentMenu = BUILDURL + "/Permission/GetByParentMenu";
//根据systemid查询权限树url
var selectPermissionBySystemidUrl = BUILDURL + "/Permission/GetAuthtreeBySystemid";


//新增角色url
var addRoleUrl = BUILDURL + "/Role/InsertRole";
//更新角色url
var editRoleUrl = BUILDURL + "/Role/UpdateRole";
//删除角色url
var delRoleUrl = BUILDURL + "/Role/DeleteRole";
//批量删除角色url
var delBatchRoleUrl = BUILDURL + "/Role/BatchDeleteRole";
//动态查询角色url（分页）
var selectRoleByPageUrl = BUILDURL + "/Role/GetByDynamicWithPage";
//根据ID查询角色url
var selectRoleByIdUrl = BUILDURL + "/Role/GetByID";
//根据角色id查询功能权限树url
var selectPermissionByRoleidUrl = BUILDURL + "/Role/GetAuthtreeByRoleid";
//根据角色id查询数据权限树url
var selectDataAuthByRoleidUrl = BUILDURL + "/Role/GetDataAuthtreeByRoleid";
//查询所有的角色
var getAllrole = BUILDURL + "/Role/getAll";
//更新角色权限
var UpdateRoleAuthUrl = BUILDURL + "/Role/UpdateRoleAuth";


//新增用户url
var addUserUrl = BUILDURL + "/Tuser/InsertUser";
//更新用户url
var editUserUrl = BUILDURL + "/Tuser/UpdateUser";
//删除用户url
var delUserUrl = BUILDURL + "/Tuser/DeleteUser";
//批量删除用户url
var delBatchUserUrl = BUILDURL + "/Tuser/BatchDeleteUser";
//批量批量启用/停用用户url
var editStausBatchUserStausUrl = BUILDURL + "/Tuser/BatchUpdateStatus";
//动态查询用户url（分页）
var selectUserByPageUrl = BUILDURL + "/Tuser/GetByDynamicWithPage";
//根据ID查询用户url
var selectUserByIdUrl = BUILDURL + "/Tuser/GetByID";
//检查用户名是否重复
var CheckUserName = BUILDURL + "/Tuser/CheckName";
//登录验证
var CheckUserLogion = BUILDURL + "/Tuser/login";
//根据用户ID和系统ID查询权限
var selectAuthoritByUserId = BUILDURL + "/Tuser/GetAuthoritByUserId";

//根据systemid查询数据权限树url
var selectDataAuthBySystemidUrl = BUILDURL + "/DataAuth/GetAuthtreeBySystemid";
//保存数据权限url
var addDataAuthUrl = BUILDURL + "/DataAuth/SaveDataauth";
//删除数据权限url
var delDataAuthUrl = BUILDURL + "/DataAuth/DeleteDataauth";
//批量删除数据权限url
var delBatchDataAuthUrl = BUILDURL + "/DataAuth/BatchDeleteDataauth";
//动态查询数据权限url
var selectDataAuthByPageUrl = BUILDURL + "/DataAuth/GetBydynamic";
//根据ID查询数据权限url
var selectDataAuthByIdUrl = BUILDURL + "/DataAuth/GetByID";
//检查数据权限名是否重复
var CheckDataAuthName = BUILDURL + "/DataAuth/CheckDataname";
//获取数据权限树的pid
var selectDataAuthTreeSpid = BUILDURL + "/DataAuth/GetTreeSpid";


//保存数据服务url
var addDataSeviceUrl = BUILDURL + "/DataService/SaveDatasevice";
//删除数据服务url
var delDataSeviceUrl = BUILDURL + "/DataService/DeleteDatasevice";
//批量删除数据服务url
var delBatchDataSeviceUrl = BUILDURL + "/DataService/BatchDeleteDatasevice";
//动态查询数据服务url
var selectDataSeviceByPageUrl = BUILDURL + "/DataService/GetBydynamic";
//根据ID查询数据服务url
var selectDataSeviceByIdUrl = BUILDURL + "/DataService/GetByID";
//检查数据服务名是否重复
var CheckDataSeviceName = BUILDURL + "/DataService/CheckServicesName";
//获取所有数据服务
var selectAllDataSevice = BUILDURL + "/DataService/getAll";

//根据用户ID查询功能权限
var selectDataSeviceByUserIdUrl = BUILDURL + "/Tuser/GetDataSeviceByUserId";
//根据角色id查询数据服务
var selectDataSeviceByRoleIdUrl = BUILDURL + "/Role/GetDataseviceByRoleid";


//保存字段url
var addColumnscommentsUrl = BUILDURL + "/ColumnsManager/SaveColumn";
//删除字段url
var delColumnscommentsUrl = BUILDURL + "/ColumnsManager/DeleteColumn";
//批量删除字段url
var delBatchColumnscommentsUrl = BUILDURL + "/ColumnsManager/BatchDeleteColumn";
//动态查询字段url
var selectColumnscommentsByPageUrl = BUILDURL + "/ColumnsManager/GetByDynamicWithPage";

//根据ID查询字段url
var selectColumnscommentsByIdUrl = BUILDURL + "/ColumnsManager/GetByID";
//检查ColumnName是否重复
var CheckColumnscommentsNameUrl = BUILDURL + "/ColumnsManager/CheckColumnName";
//获取所有的表名
var selectAllTableNameUrl = dataManagerIP + "/ColumnsManager/GetAllTableName";

//保存用户组url
var addUserGroupUrl = BUILDURL + "/userGroup/saveUserGroup";
//删除用户组url
var delUserGroupUrl = BUILDURL + "/userGroup/deleteUserGroup";
//批量删除用户组url
var delBatchUserGroupUrl = BUILDURL + "/userGroup/deleteUserGroup";
//动态查询用户组url
var selectUserGroupByPageUrl = BUILDURL + "/userGroup/getByDynamicWithPage";
//根据ID查询用户组url
var selectUserGroupByIdUrl = BUILDURL + "/userGroup/getByID";
//检查GroupName是否重复
var CheckUserGroupNameUrl = BUILDURL + "/userGroup/CheckGroupName";
//获取所有用户组
var selectAllUserGroup = BUILDURL + "/userGroup/getAll";

//新增建筑保存/编辑
var addBuildingUrl = BUILDURL + "/building/add";
//shep图层建筑物编辑保存
var BUILDINGNAMESAVE = BUILDURL + "/building/saveBtMap";
//删除建筑物属性url
var delBuildingUrl = BUILDURL + "/building/delete";
//批量删除建筑物属性url
var delBatchBuildingUrl = BUILDURL + "/building/delete";
//动态查询建筑物属性url
var selectBuildingByPageUrl = BUILDURL + "/building/getByDynamicWithPage";
//动态查询建筑物属性url
var selectBuildingByPageOldUrl = BUILDURL + "/building/getByDynamicWithPageOld";
//根据ID查询建筑物属性url
var selectBuildingByIdUrl = BUILDURL + "/building/getByDynamicWithPage";


//建筑用途联动
var BUILDINGFIRST = BUILDURL + "/buildingType/getBigType";
var BUILDINGOTHER = BUILDURL + "/buildingType/getOtherType";
//文件上传
var BUILDINGFILE = BUILDURL + "/building/upload";
//
var BUILDINGSelectFILE = BUILDURL + "/building/selectStr";

//查询
var BUILDINGSELECT = BUILDURL + "/building/select";
//图片查询
var BUILDINGSELECTS = BUILDURL + "/building/selectStr";
//附件
var PHOTOURL = "http://218.88.215.93";//服务器上的网址
var PHOTOURLNew = "http://192.168.30.55";//服务器上的网址
//var PHOTOURLNew = "http://172.1.4.162";//服务器上的网址
var ATTACHURL = PHOTOURLNew + ":8808/";
//属性值维护
//查询全部属性值
var selectGETBUILDEALL = BUILDURL + "/enum/getAll";
// 分页查询
var selectGETBUILDENUM = BUILDURL + "/enum/GetByDynamicWithPage";
//动态查询
var selectGETBUILDE = BUILDURL + "/enum/GetByDynamicWith";
//新增、编辑
var addGETBUILDENUM = BUILDURL + "/enum/save";
//删除
var delGETBUILDENUM = BUILDURL + "/enum/delete";

//所有字段名
var ALLCOLUMN = BUILDURL + "/ColumnsManager/getAllColumn"
//获取表单视图
var GETFORM = BUILDURL + "/building/getView"
//保存表单视图
var SAVEFORM = BUILDURL + "/building/saveView"
//建筑物图片反显
var BuildFile = "http://192.168.30.15:8807/"


//三维统计
var totalBuildingUrl = BUILDURL + "/building/getCount";
//三维统计年限
var totalBuildingWithdataUrl = BUILDURL + "/building/getCountWithDate";
//根据模型名查询建筑物属性url
var selectModelMsgByModelName = BUILDURL + "/building/select";


var BUILDSELECTBY = BUILDURL + "/building/selectMap";
//保存
var BUILDINFO = BUILDURL + "/building/saveBtMap";
//地图图层
var MAPLAYERS = BUILDURL + '/DataService/getAll';


