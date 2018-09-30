/**
  请注意所有的res.status == -1时，跳转登出接口的data对象要带上token属性,用于分辨是手动还是自动退出
**/

import Cookies from 'js-cookie';
import {setToken, setStore, getStore, browserDwon} from '@/config/mUtils';

let logOutCount = 0;

//重置cookie和localstorage，用于登陆和切换角色
const setCookieAndLocalstorage = (res) => {
    Cookies.set('user', res.data.user.user_name);
    Cookies.set('session_id', res.data.user.sessId);
    Cookies.set('user_no', res.data.user.user_no);
    Cookies.set('userInfo', res.data.user);
    Cookies.set('depart', res.data.depart);
    Cookies.set('current_role', res.data.current_role);
    Cookies.set('roles', res.data.roles);

    //缓存权限目录
    if (res.data.current_role && res.data.current_role.auth && res.data.current_role.auth.length > 0) {
        setStore('authArr', JSON.stringify(res.data.current_role.auth));
    }
    //缓存用户角色组用于切换角色
    if (res.data.roles && res.data.roles && res.data.roles.length === undefined) {
        setStore('userRoles', JSON.stringify(res.data.roles));
    }
    // 缓存当前团队人员，用于查询团队分析--团队成员数据
    if (res.data.member) {
        setStore('teamNumbers', JSON.stringify(res.data.member));
    }
}


/**
 * 登录接口
 */
export const apiLogin = (_this, data) => {
    return _this.$fetch('/login', data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            localStorage.clear();
            if (res.status === 1) {
                let currentRoleId = res.data.current_role.role_id;
	    	    Cookies.set('default_user_id', res.data.current_role.role_id);
                if (currentRoleId == '4' || currentRoleId == '5' || currentRoleId == '6') {
                    setStore('isService', '1');
                }
                setCookieAndLocalstorage(res);
            }
            return res;
        }
    });
};

/**
 * 登出接口
 */
export const apiLoginOut = (_this, data) => {
    return _this.$post('/logout?token=' + setToken(), data).then(res => {
        if (res.status === 1) {
            //清除cookie
            Cookies.remove('user');
            Cookies.remove('session_id');
            Cookies.remove('user_no');
            Cookies.remove('currentRoleId');

            _this.$Notice.close('greeting');
            _this.$store.commit('clearOpenedSubmenu');
            // 回复默认样式
            let themeLink = document.querySelector('link[name="theme"]');
            themeLink.setAttribute('href', '');
            // 清空打开的页面等数据，但是保存主题数据
            let theme = '';
            if (localStorage.theme) {
                theme = localStorage.theme;
            }
            localStorage.clear();
            if (theme) {
                localStorage.theme = theme;
            }
            if (data.token) {
                _this.$store.commit('showLogOutModal', true);
            } else {
                _this.$router.push({
                    path: '/login'
                });
                _this.$Message.success('退出成功');
            }
        } else {
            _this.$Message.error('退出失败');
        }
    });
};

/**
 * 切换角色接口
 */
export const switchRole = (_this, data) => {
    return _this.$fetch('/v1/role/setrole?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            if (res.status === 1) {
                if (res.data.current_role.auth && res.data.current_role.auth.length == 0) {
                    return {noAuth: true};
                }
                setCookieAndLocalstorage(res);
            } else {
                _this.$Message.error('切换角色失败');
            }
            return res;
        }
    });
};
/*修改密码接口*/
export const EditPasswordApi = (_this, data) => {
    return _this.$post('/v1/user/users/password-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*重置密码接口*/
export const ResetPasswordApi = (_this, data) => {
    return _this.$post('/login/password-reset?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取首页部门销售排行
 */
export const DepartmentsSalesApi = (_this, data) => {
    return _this.$post('/v1/stat/order/sale-distribute?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取本月下单金额总数
 */
export const getAllCashInMonth = (_this, data) => {
    return _this.$post('/v1/stat/order/this-month?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}
/**
 * 获取下单总金额
 */
export const apigetOrderAmount = (_this, data) => {
    return _this.$post('/v1/stat/order/service-order-amount?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
}

/**
 * 获取已支付总金额
 */
export const apigetPayAmount = (_this, data) => {
    return _this.$post('/v1/stat/order/pay-amount?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
}


/**
 * 获取出库总金额
 */
export const apigetOutAmount = (_this, data) => {
    return _this.$post('/v1/stat/order/out-amount?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
}

/**
 * 获取客户成交数
 */
export const apigetCustomerTotal = (_this, data) => {
    return _this.$post('/v1/stat/order/customer-total?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
}
/**
 * 获取客服待支付、待审核、待出库数量统计
 */
export const serviceIndexAmount = (_this, data) => {
    return _this.$post('/v1/stat/order/kf-order-count?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}
/**
 * 获取新客户趋势数据
 */
export const getNewCustomTrend = (_this, data) => {
    return _this.$post('/v1/stat/kh/new-trend?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}
/**
 * 获取成交客户数趋势数据
 */
export const getDealedCustomTrend = (_this, data) => {
    return _this.$post('/v1/stat/kh/bargain-quantity?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}
/**
 * 获取销售趋势
 */
export const getSalesTrend = (_this, data) => {
    return _this.$post('/v1/stat/order/trend-team?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}
/**
 * 获取退货趋势数据
 */
export const getReturnTrend = (_this, data) => {
    return _this.$post('/v1/stat/order/return-data?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}

/**
 * 获取退货趋势数据
 */
export const getBrandSalesTrend = (_this, data) => {
    return _this.$post('/v1/stat/goods-analyze/brand-sales-trend?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}

/**
 * 获取销量情况分析
 */
export const getSalesCondition = (_this, data) => {
    return _this.$post('/v1/stat/kh-analyze/sales-num?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}

/**
 * 获取销量情况分析
 */
export const TeamSalesBrand = (_this, data) => {
    return _this.$post('/v1/stat/goods-analyze/team-brand?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}
/**
 * 获取团队人员销售情况列表
 */
export const personsInTeamSales = (_this, data) => {
    return _this.$post('/v1/stat/order/stat-user?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}

/**
 * 获取本月新增、成交用户数量
 */
export const getUserNumInMonth = (_this, data) => {
    return _this.$post('/v1/stat/kh/bind-quality?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}

/**
 * 客户分布列表
 */
export const customDistrutionList = (_this, data) => {
    return _this.$post('/v1/stat/kh-analyze/distribute?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}
/**
 * 团队分析列表
 */
export const apiTeamAnalyzeList = (_this, data) => {
    return _this.$post('/v1/stat/order/stat-team?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 客户查询
 */
export const apiCustomerList = (_this, data) => {
    return _this.$post('/v1/stat/kh-analyze/kh-search?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 客户分析列表--订单分析
 */
export const apiCustAnalyzeList = (_this, data) => {
    return _this.$post('/v1/stat/kh-analyze/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 客户分析列表--出库分析
 */
export const apiCustAnalyzeListOut = (_this, data) => {
    return _this.$post('/v1/stat/kh-analyze/out-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 客户分析——销售额情况分析
 */
export const apiCustAnalyzeSalesAmount= (_this, data) => {
    return _this.$post('/v1/stat/kh-analyze/sales-amount?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 客户分析——销量情况分析
 */
export const apiCustAnalyzeSalesNum= (_this, data) => {
    return _this.$post('/v1/stat/kh-analyze/sales-num?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 客户分析——商品分析
 */
export const apiCustAnalyzeGoods= (_this, data) => {
    return _this.$post('/v1/stat/kh-analyze/goods-analyze?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 商品品牌分析首页
 */
export const apiGoodsBrandAnalyze = (_this, data) => {
    return _this.$post('/v1/stat/goods-analyze/goods-brand-analyze?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 商品品牌销售——团队分析
 */
export const apiGoodsBrandTeamAnalyze = (_this, data) => {
    return _this.$post('/v1/stat/goods-analyze/brand-team-analyze?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 商品品牌销售——系列分析
 */
export const apiGoodsBrandSeriesAnalyze = (_this, data) => {
    return _this.$post('/v1/stat/goods-analyze/brand-serial-analyze?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 商品品牌销售——商品分析
 */
export const apiGoodsProductAnalyze = (_this, data) => {
    return _this.$post('/v1/stat/goods-analyze/product-analyze?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 订单管理——订单列表
 */
export const apiOrderManageList = (_this, data) => {
    return _this.$post('/v1/stat/order/order-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 客户分析——订单列表
 */
export const apiCustomOrderManageList = (_this, data) => {
    return _this.$post('/v1/stat/order/kh-order-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 订单管理——销售合同单详情
 */
export const apiOrderManageDetail= (_this, data) => {
    return _this.$post('/v1/stat/order/order-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 订单管理——销售合同单详情退货详情
 */
export const apiOrderManageDetailReturn = (_this, data) => {
    return _this.$fetch('/v1/order/order/return-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 订单管理——询价单详情
 */
export const apiOrderInquiryDetail = (_this, data) => {
    return _this.$post('/v1/stat/order/order-inquiry?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 地区列表
 */
export const apiMapDetail = (_this, data) => {
    return _this.$fetch('/common/dq?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 发票列表
 */
export const apiInvoiceList = (_this, data) => {
    return _this.$post('/v1/invoice/invoice/invoice-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 发票新增修改
 */
export const addEditInvoince = (_this, data) => {
    return _this.$post('/v1/invoice/invoice/invoice-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 发票详情
 */
export const invoiceDetailApi = (_this, data) => {
    return _this.$post('/v1/invoice/invoice/invoice-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 发票审核
 */
export const invoiceCheckApi = (_this, data) => {
    return _this.$post('/v1/invoice/invoice/invoice-audit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 商品管理列表(运营)
 */
export const operateGoodsManageList = (_this, data) => {
    return _this.$post('/v1/product/goods/goods-info-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 商品管理列表删除(运营)
 */
export const apiDeletedGoods = (_this, data) => {
    return _this.$post('/v1/product/goods/goods-deleted?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/**
 * 商品管理列表详情(运营) steven
 */
export const operateGoodsManageDetail = (_this, data) => {
    return _this.$post('/v1/product/goods/goods-info-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 商品管理详情描述修改 steven
 */
export const operateGoodsDisEdit = (_this, data) => {
    return _this.$post('/v1/product/goods/save-cpxqms?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 商品管理详情信息修改 steven
 */
export const operateGoodsDetailEdit = (_this, data) => {
    return _this.$post('/v1/product/goods/goods-info-modify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 商品管理图片信息修改 steven
 */
export const operateGoodsPicsEdit = (_this, data) => {
    return _this.$post('/v1/product/goods/save-cptp?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**价格管理价格信息修改 steven
 */
export const operatePriceEdit = (_this, data) => {
    return _this.$post('/v1/product/goods/price-goods-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**价格导入模板
 */
export const priceImport = (_this, data) => {
    return _this.$post('/v1/product/goods/price-import-template?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            browserDwon(res);
        }
    });
};
/**销售合同单删除
 */
export const deleteItems = (_this, data) => {
    return _this.$post('/v1/product/goods/price-goods-delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**面价导出模板
 */
export const priceExport = (_this, data) => {
    return _this.$post('/v1/product/goods/export-price-goods-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
/**商品管理列表导出
 */
export const goodsListExport = (_this, data) => {
    return _this.$post('/v1/product/goods/export-goods?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
/**折扣导出模板
 */
export const discountExport = (_this, data) => {
    return _this.$post('/v1/product/goods/discount-import-template?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};

/**批量上架
 */
export const batchUp = (_this, data) => {
    return _this.$post('/v1/product/goods/price-goods-online?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};

/**批量下架
 */
export const batchDown = (_this, data) => {
    return _this.$post('/v1/product/goods/price-goods-outline?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
/**确认出库/取消出库接口 ——销售出库单
 */
export const apiSalesOutBound = (_this, data) => {
    return _this.$post('/v1/order/out-bound/confirm-out?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**运营首页
 */
export const operateIndexSales = (_this, data) => {
    return _this.$post('/v1/stat/goods-analyze/goods-and-brand?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
/**商品管理激活冻结
 */
export const activeAndFrozen = (_this, data) => {
    return _this.$post('/v1/product/goods/freeze-active?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
/**上架筛选列表
 */
export const upSelectedGoodsApi = (_this, data) => {
    return _this.$post('/v1/product/goods/sj?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
/**待上架产品列表
 */
export const goodsToSale = (_this, data) => {
    return _this.$post('/v1/product/goods/wait-sj-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
/**面价导入
 */
export const MJimportApi = (_this, data) => {
    return _this.$post('/v1/product/goods/price-import?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
/**新增单审批
 */
export const xzdCheckApi = (_this, data) => {
    return _this.$post('/v1/product/products/cpxzd-check?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
/**新增单删除
 */
export const xzdDeleteApi = (_this, data) => {
    return _this.$post('/v1/product/products/cpxzd-delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};

/**商品新增单导入模板
 */
export const apiExportTemplate = (_this, data) => {
    return _this.$post('/v1/product/products/export-template-cpxzd?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        browserDwon(res);
    }
});
};

/**折扣导入
 */
export const ZKimportApi = (_this, data) => {
    return _this.$post('/v1/product/goods/discount-import?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
/**新增单列表
 */
export const newNoteList = (_this, data) => {
    return _this.$post('/v1/product/products/cpxzd-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
/**
 * 获取所有产品品牌列表
 */
export const operateAllBrandsList = (_this, data) => {
    return _this.$post('/v1/product/products/active-cppp?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取所有产品类别列表
 */
export const operateAllBrandstype = (_this, data) => {
    return _this.$post('/v1/product/products/cplb-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 产品价格单列表(运营)
 */
export const operateGoodsPriceList = (_this, data) => {
    return _this.$post('/v1/product/goods/price-goods-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 产品新增单列表(运营)
 */
export const operateProductAddList = (_this, data) => {
    return _this.$post('/v1/product/products/increased-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 产品新增单审核(运营)
 */
export const operateProductAddDetailCheck = (_this, data) => {
    return _this.$post('/v1/product/products/increased-check?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 验证码查询
 */
export const operateIdentifyingCode = (_this, data) => {
    return _this.$post('/v1/admin/sms-diary/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 验证码事件查询
 */
export const operateIdentifyingCodeEvent = (_this, data) => {
    return _this.$fetch('v1/admin/sms-diary/event-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 运费管理
 */
export const operateCarriageManage = (_this, data) => {
    return _this.$post('v1/admin/freight-manage/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 运费管理更新
 */
export const operateCarriageManageUpdate = (_this, data) => {
    return _this.$post('v1/admin/freight-manage/update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 所有部门
 */
export const systemManageAllDeparts = (_this, data) => {
    return _this.$fetch('v1/admin/depart/all-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 员工管理列表
 */
export const systemManageStaffList = (_this, data) => {
    return _this.$post('v1/admin/user/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 员工管理列表
 */
export const systemManageStaffEdit = (_this, data) => {
    return _this.$post('v1/admin/user/edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 员工启用和禁用
 */
export const systemManageStaffActive = (_this, data) => {
    return _this.$post('v1/admin/user/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 员工删除
 */
export const systemManageStaffDelete = (_this, data) => {
    return _this.$post('v1/admin/user/delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 产品新增单明细删除(运营)
 */
export const operateProductAddDetailDelete = (_this, data) => {
    return _this.$post('/v1/product/products/increased-product-deleted?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 产品新增单明细保存(运营)
 */
export const operateProductAddDetailSave = (_this, data) => {
    return _this.$post('/v1/product/products/increased-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 产品新增单明细失败数据导出(运营)
 */
export const operateProductAddDetailFailedExport = (_this, data) => {
    return _this.$post('/v1/product/products/error-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
/**
 * 产品新增单导入模板下载(运营)
 */
export const operateProductAddTmplateDown = (_this, data) => {
    return _this.$post('/v1/product/products/export-template?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
/**
 * 产品新增单导入(运营)
 */
export const operateProductAddDetailImport = (_this, data) => {
    return _this.$post('/v1/product/products/increased-import?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 产品新增单明细(运营)
 */
export const operateProductAddDetail = (_this, data) => {
    return _this.$fetch('/v1/product/products/increased-details?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 产品新增单删除(运营)
 */
export const operateProductAddDelete = (_this, data) => {
    return _this.$fetch('/v1/product/products/increased-deleted?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 批量修改产品编码
 */
export const apiTaxCodeEdit = (_this, data) => {
    return _this.$post('/v1/product/products/tax-code-edit?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客户来源列表(运营)
 */
export const apiCustomerSource = (_this, data) => {
    return _this.$fetch('/v1/customers/customer/customer-source?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 客户来源新增(运营)
 */
export const apiAddSource = (_this, data) => {
    return _this.$post('/v1/customers/customer/add-source?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 客户来源编辑(运营)
 */
export const apiEditSource = (_this, data) => {
    return _this.$post('/v1/customers/customer/edit-source?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 客户来源删除(运营)
 */
export const apiDelSource = (_this, data) => {
    return _this.$fetch('/v1/customers/customer/del-source?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 客户类型列表(运营)
 */
export const apiCustomerType = (_this, data) => {
    return _this.$fetch('/v1/customers/customer/customer-type?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 客户类型新增(运营)
 */
export const apiAddType = (_this, data) => {
    return _this.$post('/v1/customers/customer/add-type?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客户类型编辑(运营)
 */
export const apiEditType = (_this, data) => {
    return _this.$post('/v1/customers/customer/edit-type?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客户类型删除(运营)
 */
export const apiDelType = (_this, data) => {
    return _this.$fetch('/v1/customers/customer/del-type?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 客户等级列表(运营)
 */
export const apiCustomerGrade = (_this, data) => {
    return _this.$fetch('/v1/customers/customer/customer-grade?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 客户等级新增(运营)
 */
export const apiAddGrade = (_this, data) => {
    return _this.$post('/v1/customers/customer/add-grade?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客户等级编辑(运营)
 */
export const apiEditGrade = (_this, data) => {
    return _this.$post('/v1/customers/customer/edit-grade?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客户等级删除(运营)
 */
export const apiDelGrade = (_this, data) => {
    return _this.$fetch('/v1/customers/customer/del-grade?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客服销售排行
 */
export const serviceSalesRank = (_this, data) => {
    return _this.$post('/v1/stat/order/sale-rank?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


/**
 * 客服出库排行
 */
export const serviceCkRank = (_this, data) => {
    return _this.$post('/v1/stat/order/ck-rank?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客户分配列表
 */
export const customerDistribution = (_this, data) => {
    return _this.$post('/v1/customers/customer/distribution-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 客户分配启用/禁用
 */
export const apicustomerDistributionState = (_this, data) => {
    return _this.$post('/v1/customers/customer/distribution-state?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/**
 * 客户分配
 */
export const customerDistribute = (_this, data) => {
    return _this.$post('/v1/customers/customer/update-khassign?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
/**
 * 订单管理——退货单详情
 */
export const apiOrderReturnDetail = (_this, data) => {
    return _this.$post('/v1/stat/order/order-return?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 所有客户列表
 */
export const apiAllKh = (_this, data) => {
    return _this.$post('/v1/customers/customer/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取产品品牌
 */
export const apiAllBrands = (_this, data) => {
    return _this.$fetch('/v1/product/products/product-brands?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 商品新增单导入
 */
export const apiImportGoods = (_this, data) => {
    return _this.$post('/v1/product/products/import-goods?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/**
 * 上传新增单数据
 */
export const createCpxzd = (_this, data) => {
    return _this.$post('/v1/product/products/create-cpxzd?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取新增单详情
 */
export const getcpxzdDetail = (_this, data) => {
    return _this.$fetch('/v1/product/products/cpxzd-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取产品类别
 */
export const apiAlltypes = (_this, data) => {
    return _this.$fetch('/v1/product/products/cplb?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取产品系列
 */
export const apiAllSeries = (_this, data) => {
    return _this.$post('/v1/product/products/product-series?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//------------------------------------获取状态方法开始-------------------------------------------
export const apiAllStatus = (_this, data) => {
    return _this.$post('common/status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取发票
 */
export const getinvoiceList = () => {
    return JSON.parse(getStore('status_list'))['fplx'];
};
/**
 * 是否企业认证
 */
export const getIsQyrz = () => {
    return JSON.parse(getStore('status_list'))['is_qyrz'];
};
/**
 * 支付状态
 */
export const getpayStatus = () => {
    return JSON.parse(getStore('status_list'))['khzfzt'];
};
/**
 * 开票状态
 */
export const getInvoiceStatus = () => {
    return JSON.parse(getStore('status_list'))['kpzt'];
};
/**
 * 退货状态
 */
export const getreturnStatus = () => {
    return JSON.parse(getStore('status_list'))['thzt'];
};
/**
 * 订单状态
 */
export const getorderStatus = () => {
    return JSON.parse(getStore('status_list'))['xshtdzt'];
};
/**
 * 支付方式
 */
export const getpayWays = () => {
    return JSON.parse(getStore('status_list'))['zffs'];
};
/**
 * 报价状态
 */
export const getBjStatus = () => {
    return JSON.parse(getStore('status_list'))['xjd_status'];
};
/**
 * 积分来源
 */
export const getPointFrom = () => {
    return JSON.parse(getStore('status_list'))['point_from'];
};
/**
 * 积分行为
 */
export const getPointAction = () => {
    return JSON.parse(getStore('status_list'))['point_action'];
};
/**
 * 客户状态
 */
export const getkhisDeleted = () => {
    return JSON.parse(getStore('status_list'))['kh_is_deleted'];
};
/**
 * 是否VIP
 */
export const getisVip = () => {
    return JSON.parse(getStore('status_list'))['is_vip'];
};
/**
 * 是否免运
 */
export const getisMy = () => {
    return JSON.parse(getStore('status_list'))['is_my'];
};
/**
 * 时间转换成时间戳
 * 默认不是时间戳，chuo=1的时候转换
 */
export const apiTimeChange = (time, chuo) => {
    if (chuo === 1){
        //单个时间转换时间戳
        if (time.length === 1) {
            time = new Date(time).getTime();
        } else if (time.length > 1) {
            for (let i=0; i<time.length; i++) {
                time[i] = new Date(time[i]).getTime();
            }
            time = time.join('~');
        }
    } else {
        time = time.join('~');
    }
    return time;
}
/**
 * 时间戳转换成date日期格式
 */
export const dateChange = (time) => {
    return time < 10 ? '0' + time : time;
}
export const apiDateChange = (timenum, needHour) => {
    const time = new Date(parseInt(timenum));
    const y = time.getFullYear();
    const m = time.getMonth()+1;
    const d = time.getDate();
    const h = time.getHours();
    const mm = time.getMinutes();
    const s = time.getSeconds();
    if (!needHour) {
       return y+'-'+dateChange(m)+'-'+dateChange(d)+' '+dateChange(h)+':'+dateChange(mm)+':'+dateChange(s);
    } else {
        return y+'-'+dateChange(m)+'-'+dateChange(d);
    }
}
/**
 * 时间戳转换成date日期格式，自带几个小时以后或者之前
 */
export const apiDateAfterChange = (timenum, atime) => {
    timenum = parseInt(timenum) + parseInt(atime * 3600);
    const time = new Date(parseInt(timenum) * 1000);
    const y = time.getFullYear();
    const m = time.getMonth()+1;
    const d = time.getDate();
    const h = time.getHours();
    const mm = time.getMinutes();
    const s = time.getSeconds();
    return y+'-'+dateChange(m)+'-'+dateChange(d)+' '+dateChange(h)+':'+dateChange(mm)+':'+dateChange(s);
}

/**
 * 客户详情 （客服）
 */
export const apiCustomDetail = (_this, data) => {
    return _this.$post('/v1/stat/kh/custom-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 客户管理列表（客服）
 */
export const apiCustommanageList = (_this, data) => {
    return _this.$post('/v1/stat/kh/custom-manage?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


/**
 * 开票管理列表 (客服)
 */
export const apiBillingList = (_this, data) => {
    return _this.$post('/v1/billing/billing/billing-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售合同单列表（客服）
 */
export const apiSalesHtdList = (_this, data) => {
    return _this.$post('/v1/order/order/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售合同单基本信息和收货信息详情（客服）
 */
export const apiSalesHtdBasicInfo = (_this, data) => {
    return _this.$fetch('/v1/order/order/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 销售合同单基本信息导出（客服）
 */
export const apiSalesHtdBasicInfoExport = (_this, data) => {
    return _this.$fetch('/v1/order/order/detail-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};





/**
 * 销售合同单请购信息（客服）
 */
export const apiSalesHtdRequsitionInfo = (_this, data) => {
    return _this.$fetch('/v1/order/order/requisition-records?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售合同单待请购信息（客服）
 */
export const apiSalesHtdRequsitionReady = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/ready-list-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售合同单商品详情（客服）
 */
export const apiSalesHtdDetail = (_this, data) => {
    return _this.$fetch('/v1/order/order/products?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售合同单商品详情（客服）
 */
export const apiSalesHtdChangeDetail = (_this, data) => {
    return _this.$fetch('/v1/order/order/change-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 销售合同单基本信息和收货信息修改（客服）
 */
export const apiSalesHtdInfoModify = (_this, data) => {
    return _this.$post('/v1/order/order/edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售合同单申请售后（客服）GET
 */
export const apiSalesHtdApplyReturn = (_this, data) => {
    return _this.$fetch('/v1/order/order/apply-return?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售合同单申请售后提交（客服）POST
 */
export const apiSalesHtdApplyReturnSave = (_this, data) => {
    return _this.$post('/v1/order/order/apply-return-save?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售退货申请列表（客服）
 */
export const apiSalesReturnApplyList = (_this, data) => {
    return _this.$post('/v1/order/sell/return/apply-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售退货申请详情（客服）
 */
export const apiSalesReturnApplyDetail = (_this, data) => {
    return _this.$fetch('/v1/order/sell/return/apply-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售退货申请详情商品明细修改（客服）
 */
export const apiSalesReturnApplyEdit = (_this, data) => {
    return _this.$post('/v1/order/sell/return/apply-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售退货申请详情状态跟新（客服）
 */
export const apiSalesReturnApplyStatus= (_this, data) => {
    return _this.$post('/v1/order/sell/return/apply-update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售退货申请详情完成（客服）
 */
export const apiSalesReturnApplyComplete= (_this, data) => {
    return _this.$post('/v1/order/sell/return/apply-complete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售合同单详情发票信息（客服）
 */
export const apiSalesOrderInvoiceDetail= (_this, data) => {
    return _this.$fetch('/v1/order/order/invoice-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售退款单列表（客服）
 */
export const apiSalesRefundList= (_this, data) => {
    return _this.$post('/v1/order/sell/refund/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 销售退款单详情完成（客服）
 */
export const apiSalesRefundDetail= (_this, data) => {
    return _this.$fetch('/v1/order/sell/refund/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售退款单详情作废（客服）
 */
export const apiSalesRefundAbolish= (_this, data) => {
    return _this.$post('/v1/order/sell/refund/abolish?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售退款单详情退款（客服）
 */
export const apiSalesRefundFinish= (_this, data) => {
    return _this.$post('/v1/order/sell/refund/finish?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 销售退款单详情生成退款单（客服）
 */
export const apiSalesRefundReady= (_this, data) => {
    return _this.$post('/v1/order/sell/refund/ready?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 销售退款单详情生成退款单（客服）
 */
export const apiSalesRefundCreate= (_this, data) => {
    return _this.$post('/v1/order/sell/refund/create?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 发货方式获取（客服）
 */
export const apisendWays= (_this, data) => {
    return _this.$fetch('/v1/order/order/shipping-method?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单收货地址自提地址（客服）
 */
export const apiSelfTakeAddress = (_this, data) => {
    return _this.$fetch('/v1/order/order/self-take-address?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单商品明细修改（客服）
 */
export const apiServiceSalesGoodsModify = (_this, data) => {
    return _this.$post('/v1/order/order/product-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单商品明细批量添加（客服）
 */
export const apiServiceSalesGoodsAdd = (_this, data) => {
    return _this.$post('/v1/order/order/product-batch-search?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单商品审核通过（客服）
 */
export const apiServiceSalesCheckPass = (_this, data) => {
    return _this.$post('/v1/order/order/check-pass?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单商品释放（客服）
 */
export const apiServiceSalesFree = (_this, data) => {
    return _this.$post('/v1/order/order/free?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单新阳同步（客服）
 */
export const apiServiceSalesXync = (_this, data) => {
    return _this.$post('/v1/order/order/xy-sync?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单新阳同步（客服）
 */
export const apiServiceSalesXydelete = (_this, data) => {
    return _this.$post('/v1/order/order/xy-delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单商品激活订单（客服）
 */
export const apiServiceSalesRecover = (_this, data) => {
    return _this.$post('/v1/order/order/recover?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单商品订单作废（客服）
 */
export const apiServiceSalesVoid = (_this, data) => {
    return _this.$post('/v1/order/order/void?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单商品订单作废（客服）
 */
export const apiServiceSalesUnlock = (_this, data) => {
    return _this.$post('/v1/order/order/unlock?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单收款信息（客服）
 */
export const apiServiceToPayInfo = (_this, data) => {
    return _this.$fetch('/v1/order/order/to-pay-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 *销售合同单收款信息（客服）
 */
export const apiServiceReceiptInfo = (_this, data) => {
    return _this.$post('/v1/order/order/receipt-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 收款单列表（客服）
 */
export const apiSkdList = (_this, data) => {
    return _this.$post('/v1/order/receipt/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 销售收款单导出
 */
export const apiExportSkdList = (_this, data) => {
    return _this.$post('/v1/order/receipt/export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
});
};

/**
 * 收款单详情（客服）
 */
export const apiSkdDetail = (_this, data) => {
    return _this.$post('/v1/order/receipt/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 收款（客服）
 */
export const apiSkdCollect = (_this, data) => {
    return _this.$post('/v1/order/receipt/collect?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 收款单作废（客服）
 */
export const apiSkdAbolish = (_this, data) => {
    return _this.$post('/v1/order/receipt/abolish?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 收款信息获取（客服）
 */
export const apiSkdInfo = (_this, data) => {
    return _this.$post('/v1/order/receipt/billing?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 出库单列表（客服）
 */
export const apiCkdList = (_this, data) => {
    return _this.$post('/v1/order/out-bound/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 出库单详情（客服）
 */
export const apiCkdDetail = (_this, data) => {
    return _this.$post('/v1/order/out-bound/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 出库单作废（客服）
 */
export const apiCkdAbolish = (_this, data) => {
    return _this.$post('/v1/order/out-bound/abolish?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 出库接口（客服）
 */
export const apiCkdLibrary = (_this, data) => {
    return _this.$post('/v1/order/out-bound/library?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 出库单详情信息（客服）
 */
export const apiCkdInfo = (_this, data) => {
    return _this.$post('/v1/order/out-bound/details-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 退货单列表（客服）
 */
export const apiThdList = (_this, data) => {
    return _this.$post('/v1/order/sell/return/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 退货单详情（客服）
 */
export const apiThdDetail = (_this, data) => {
    return _this.$post('/v1/order/returns/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

export const apiThdDetailNew = (_this, data) => {
    return _this.$post('/v1/order/sell/return/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

export const apiThdDetailAddNew = (_this, data) => {
    return _this.$post('/v1/order/sell/return/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

export const apiThdDetailBasicEdit = (_this, data) => {
    return _this.$post('/v1/order/sell/return/edit-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 退货单详情（客服）
 */
export const apiThdDetailAll = (_this, data) => {
    return _this.$post('/v1/order/returns/allthd?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 退货单修改数量（客服）
 */
export const apiThdReturn = (_this, data) => {
    return _this.$post('/v1/order/returns/return?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

export const apiThdReturnNew = (_this, data) => {
    return _this.$post('/v1/order/sell/return/edit-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

export const apiThdReturnDeleteNew = (_this, data) => {
    return _this.$post('/v1/order/sell/return/delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const serviceManageTHUpdate = (_this, data) => {
    return _this.$post('/v1/order/sell/return/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const ServiceTHModelName = (_this, data) => {
    return _this.$fetch('/v1/order/sell/return/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


/** 客服合同修改单开始**/
export const apiHtxgdList = (_this, data) => {
    return _this.$post('/v1/order/sell/change/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiHtxgdDetail = (_this, data) => {
    return _this.$post('/v1/order/sell/change/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiHtxgdDetailEdit = (_this, data) => {
    return _this.$post('/v1/order/sell/change/edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiHtxgdDetailModalName = (_this, data) => {
    return _this.$fetch('/v1/order/sell/change/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiHtxgdDetailDelete = (_this, data) => {
    return _this.$post('/v1/order/sell/change/delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiHtxgdDetailReadyMake = (_this, data) => {
    return _this.$post('/v1/order/sell/change/need-change?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiHtxgdDetailAdd = (_this, data) => {
    return _this.$post('/v1/order/sell/change/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiHtxgdDetailUpdate = (_this, data) => {
    return _this.$post('/v1/order/sell/change/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


export const apixskpdList = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apixskpdDetailList = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/detail-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apixskpdShipList = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/ship-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apixskpdDetail = (_this, data) => {
    return _this.$fetch('/v1/order/sell/invoice/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apixskpdDetailPass = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/pass?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apixskpdDetailBilling = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/invoice?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apixskpdDetailEdit = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/modify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


export const apithrkdList = (_this, data) => {
    return _this.$post('/v1/order/sell/instock/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 退货入库单明细列表
 */
export const apithrkdMxList = (_this, data) => {
    return _this.$post('/v1/order/sell/instock/details-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


export const apithrkdDetail= (_this, data) => {
    return _this.$fetch('/v1/order/sell/instock/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apithrkdDetailEdit = (_this, data) => {
    return _this.$post('/v1/order/sell/instock/modify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apithrkdDetailFinish= (_this, data) => {
    return _this.$post('/v1/order/sell/instock/finish?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiToMakeThrkd = (_this, data) => {
    return _this.$fetch('/v1/order/sell/return/create-instock-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiMakeThrkd= (_this, data) => {
    return _this.$post('/v1/order/sell/instock/create?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/** 客服合同修改单结束**/
/**
 * 退款接口（客服）
 */
export const apiThdMoney = (_this, data) => {
    return _this.$post('/v1/order/returns/return-money?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 退款审批接口（客服）
 */
export const apiThdApproved = (_this, data) => {
    return _this.$post('/v1/order/returns/approved?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 询价管理列表（客服）
 */
export const apiServiceInqueryList= (_this, data) => {
    return _this.$post('/v1/order/inquiry/inquiry-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 询价管理询价单详情（客服）
 */
export const apiServiceInqueryDetail= (_this, data) => {
    return _this.$post('/v1/order/inquiry/inquiry-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 询价管理询价单详情基本信息修改（客服）
 */
export const apiServiceInqueryBasicModify= (_this, data) => {
    return _this.$post('/v1/order/inquiry/info-modify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 询价管理询价单详情修改询价状态（客服）
 */
export const apiServiceInqueryModifyState= (_this, data) => {
    return _this.$post('/v1/order/inquiry/state?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 询价管理询价单商品详情修改（客服）
 */
export const apiServiceInqueryGoodsModify = (_this, data) => {
    return _this.$post('/v1/order/inquiry/detail-modify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 询价管理询价单商品详情删除（客服）
 */
export const apiServiceInqueryGoodsDelete = (_this, data) => {
    return _this.$post('/v1/order/inquiry/detail-delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 询价管理询价单商品详情删除（客服）
 */
export const apiServiceInqueryGoodsAdd = (_this, data) => {
    return _this.$post('/v1/order/inquiry/detail-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 客户信息接口（客服）
 */
export const apiCustomerInfoList = (_this, data) => {
    return _this.$post('/v1/customers/customer/customer-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 客户绑定的客服/销售（客服）
 */
export const apiCustomerAllStaff = (_this, data) => {
    return _this.$post('/v1/customers/customer/staff?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取指定部门
 */
export const apiGetDepart = (_this, data) => {
    return _this.$post('/common/get-depart?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客户绑定的客服转移/销售（客服）
 */
export const apiCustomerStaffTransfer = (_this, data) => {
    return _this.$post('/v1/customers/customer/transfer?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 客户基本信息详情获取
 */
export const apiCustomerBasicInfo = (_this, data) => {
    return _this.$post('/v1/customers/customer/basic-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客户基本信息修改
 */
export const apiCustomerBasicModify = (_this, data) => {
    return _this.$post('/v1/customers/customer/basic-modify?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 客户基本信息修改
 */
export const apiCustomerIntegralInfo = (_this, data) => {
    return _this.$post('/v1/customers/customer/integral-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};



/**
 * 客户积分修改
 */
export const apiCustomerIntegralModify = (_this, data) => {
    return _this.$post('/v1/customers/customer/integral-modify?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客户等级变动记录
 */
export const apiCustomerGradeInfo = (_this, data) => {
    return _this.$post('/v1/customers/customer/grade-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客户地址信息
 */
export const apiCustomerAddressInfo = (_this, data) => {
    return _this.$post('/v1/customers/customer/address-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 客户企业认证信息
 */
export const apiCustomerAuthenticationInfo = (_this, data) => {
    return _this.$post('/v1/customers/customer/authentication-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};



/**
 * 客户开票信息
 */
export const apiCustomerInvoiceInfo = (_this, data) => {
    return _this.$post('/v1/customers/customer/invoice-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/* 客户开票信息删除*/
export const apiDeletedCustomInvoice = (_this, data) => {
    return _this.$fetch('/v1/customers/customer/deleted-invoice?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 客户开票信息修改*/
export const apiEditCustomInvoice = (_this, data) => {
    return _this.$post('/v1/customers/customer/edit-invoice?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};



/**
 * 客户审核操作
 */
export const apiCustomerAuthenticationExamine = (_this, data) => {
    return _this.$post('/v1/customers/customer/authentication-examine?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 添加客户
 */
export const apiCustomerAdd = (_this, data) => {
    return _this.$post('/v1/customers/customer/add-customers?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 认证信息修改
 */
export const apiCustomerAuthenticationModify = (_this, data) => {
    return _this.$post('/v1/customers/customer/authentication-modify?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 开票详情
 */
export const apiBillingDetail = (_this, data) => {
    return _this.$post('/v1/billing/billing/billing-detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 开票详情修改
 */
export const apiBillingUpdate = (_this, data) => {
    return _this.$post('/v1/billing/billing/billing-update?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 开票作废
 */
export const apiBillingInvalid = (_this, data) => {
    return _this.$post('/v1/billing/billing/billing-invalid?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/**
 * 开票作废
 */
export const apiBillingOpening = (_this, data) => {
    return _this.$post('/v1/billing/billing/billing-opening?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/**
 * 获取客服销售列表
 */
export const apiGetsalesService = (_this, data) => {
    return _this.$fetch('/v1/stat/kh/sales-service?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品品牌列表
 */
export const apiGetProductBrandList = (_this, data) => {
    return _this.$post('/v1/product/brand/brand-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品品牌详情
 */
export const apiGetProductBrandDetail = (_this, data) => {
    return _this.$post('/v1/product/brand/brand-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品品牌修改
 */
export const apiGetProductBrandModify = (_this, data) => {
    return _this.$post('/v1/product/brand/brand-modify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品品牌新增
 */
export const apiGetProductBrandAdd = (_this, data) => {
    return _this.$post('/v1/product/brand/brand-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品列表
 */
export const apiGetProductSeriesList = (_this, data) => {
    return _this.$post('/v1/product/products/series-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


/**
 * 获取运营产品列表
 */
export const apiGetProductGetCpxh = (_this, data) => {
    return _this.$post('/v1/product/products/get-cpxh?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};



/**
 * 产品转移
 */
export const apiGetProductCpxhTransfer = (_this, data) => {
    return _this.$post('/v1/product/products/cpxh-transfer?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};



/**
 * 获取运营产品冻结、激活
 */
export const apiGetProductSeriesOperation = (_this, data) => {
    return _this.$post('/v1/product/products/operation?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品系列详情
 */
export const apiGetProductSeriesDetail = (_this, data) => {
    return _this.$post('/v1/product/products/series-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品系列新增
 */
export const apiGetProductSeriesAdd = (_this, data) => {
    return _this.$post('/v1/product/products/series-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品系列信息修改
 */
export const apiGetProductSeriesModify = (_this, data) => {
    return _this.$post('/v1/product/products/series-modify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品系列图片上传
 */
export const apiGetProductSeriesPic = (_this, data) => {
    return _this.$post('/v1/product/products/maintain-pic?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品描述修改
 */
export const apiGetProductSeriesCpxqmsKeep = (_this, data) => {
    return _this.$post('/v1/product/products/cpxqms-keep?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品类别
 */
export const apiGetProductTypeObtain = (_this, data) => {
    return _this.$fetch('/v1/product/category/category-obtain?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品类别列表
 */
export const apiGetProductTypeList = (_this, data) => {
    return _this.$post('/v1/product/category/category-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品类别列表
 */
export const apiGetProductTypeListInfo = (_this, data) => {
    return _this.$post('/v1/product/category/category-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品类别修改
 */
export const apiGetProductTypeModify = (_this, data) => {
    return _this.$post('/v1/product/category/category-modify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品类别新增
 */
export const apiGetProductTypeAdd = (_this, data) => {
    return _this.$post('/v1/product/category/category-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营产品类别导出
 */
export const apiGetProductTypeExport = (_this, data) => {
    return _this.$post('/v1/product/products/series-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};


/**
 * 销售合同单客户信息修改
 */
export const apiCustomerInfoDetail = (_this, data) => {
    return _this.$post('/v1/order/order/customer-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 获取运营限时秒杀列表
 */
export const apiGetSalesLimitTimeList = (_this, data) => {
    return _this.$post('/v1/activity/seckill/seckill-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 秒杀模板
 */
export const apiGetSalesLimitTimeTemplate = (_this, data) => {
    return _this.$post('/v1/activity/seckill/import-template?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
/**
 * 获取运营限时秒杀详情
 */
export const apiGetSalesLimitTimeDetail = (_this, data) => {
    return _this.$post('/v1/activity/seckill/basic-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营限时秒杀详情
 */
export const apiGetSalesLimitGoodsDetail = (_this, data) => {
    return _this.$post('/v1/activity/seckill/product-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/**
 * 获取运营限时秒杀新增
 */
export const apiGetSalesLimitTimeAdd = (_this, data) => {
    return _this.$post('/v1/activity/seckill/seckill-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营限时秒杀新增
 */
export const apiGetSalesLimitProImport = (_this, data) => {
    return _this.$post('/v1/activity/seckill/product-import?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营限时秒杀删除
 */
export const apiGetSalesLimitDelete= (_this, data) => {
    return _this.$post('/v1/activity/seckill/deleted-seckill?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营限时秒杀停用
 */
export const apiGetSalesLimitStop = (_this, data) => {
    return _this.$post('/v1/activity/seckill/end-promotion?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/**
 * 获取运营限时秒杀操作
 */
export const apiGetSalesLimitOperation= (_this, data) => {
    return _this.$post('/v1/activity/seckill/operation?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


//采购--swj--开始
/* 采购模块采购管理--所有仓库 */
export const allStoreInfos = (_this, data) => {
    return _this.$post('/common/stores?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--采购退货单详情 */
export const purchaseManageReturnDetail = (_this, data) => {
    return _this.$post('/v1/order/buy/return/return-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--采购退货单详情修改 */
export const purchaseManageReturnDetailEdit = (_this, data) => {
    return _this.$post('/v1/order/buy/return/product-modify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--采购退货单列表 */
export const purchaseManageReturnList = (_this, data) => {
    return _this.$post('/v1/order/buy/return/return-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--采购退货单详情基本信息修改 */
export const purchaseManageReturnDetailBasicEdit = (_this, data) => {
    return _this.$post('/v1/order/buy/return/basic-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*供应商详情接口*/
export const apiGetPurchaseSupplierDetail = (_this, data) => {
    return _this.$fetch('/v1/supply/supplier/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*供应商详情修改接口*/
export const apiGetPurchaseSupplierDetailEdit = (_this, data) => {
    return _this.$post('/v1/supply/supplier/edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--采购退货单详情基本信息修改 */
export const purchaseManageReturnDelete = (_this, data) => {
    return _this.$post('/v1/order/buy/return/deleted-return?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--采购退货单详情新增 */
export const purchaseManageReturnAdd= (_this, data) => {
    return _this.$post('/v1/order/buy/return/retreat-goods?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--采购退货单生成退货单确认 */
export const purchaseManageConfirmReturn= (_this, data) => {
    return _this.$post('/v1/order/buy/return/return-generate?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--采购退货单生成退货单确认生成 */
export const purchaseManageConfirmAdd= (_this, data) => {
    return _this.$post('/v1/order/buy/return/add-return?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--供应商删除 */
export const purchaseManageApplyDelete= (_this, data) => {
    return _this.$post('/v1/supply/supplier/delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--供应商激活 */
export const purchaseManageApplyActive= (_this, data) => {
    return _this.$post('/v1/supply/supplier/recover?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--供应商冻结 */
export const purchaseManageApplyFrezon= (_this, data) => {
    return _this.$post('/v1/supply/supplier/freeze?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--收票单明细列表 */
export const purchaseManageSPList= (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/invoice-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 采购模块采购管理--收票单列表 */
export const purchaseManageSPIndexList= (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 采购模块采购管理--收票单详情 */
export const purchaseManageSPDetail= (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/invoice-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--收票单基本信息编辑 */
export const purchaseManageSPBasicEdit= (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/update-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--收票单删除 */
export const purchaseManageSPDelete= (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/del-invoice?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--收票单--收票单明细修改 */
export const purchaseManageSPNomalEdit= (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/update-indetail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--收票单--退票单明细修改 */
export const purchaseManageSPBackEdit= (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/update-backdetail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--售票单状态修改 */
export const purchaseManageSPUpdate= (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--首页任务详情 */
export const purchaseManageHomeTask= (_this, data) => {
    return _this.$fetch('/v1/workflow/my-task-stat?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--首页任务列表 */
export const purchaseManageHomeTaskList= (_this, data) => {
    return _this.$post('/v1/workflow/my-task?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--出库单列表 */
export const purchaseManageOutputList= (_this, data) => {
    return _this.$post('/v1/order/buy/outstock/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--出库单列表 */
export const purchaseManageOutputDetail= (_this, data) => {
    return _this.$post('/v1/order/buy/outstock/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--出库单作废 */
export const purchaseManageOutputAbolish= (_this, data) => {
    return _this.$post('/v1/order/buy/outstock/abolish?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--判断是否是当前审批人/最终执行人 */
export const purchaseManageCheckApproval= (_this, data) => {
    return _this.$fetch('/v1/workflow/get-task-processer?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--通过单据编号获取工作流任务信息 */
export const purchaseManageGetWorkFlow= (_this, data) => {
    return _this.$fetch('/v1/workflow/get-task-by-order-no?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--获取所有可创建人 */
export const purchaseManageInCreator= (_this, data) => {
    return _this.$fetch('/v1/workflow/get-creater?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--获取售票单模型名称 */
export const purchaseManageSPModel= (_this, data) => {
    return _this.$fetch('/v1/order/buy/invoice/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--获取供应商模型名称 */
export const purchaseManageApplyModel= (_this, data) => {
    return _this.$post('/v1/supply/supplier/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--获取工作流 */
export const purchaseManageWorkFlow= (_this, data) => {
    return _this.$fetch('/v1/workflow/get-task-by-order-no?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--执行审批动作 */
export const purchaseManageApproveAction= (_this, data) => {
    return _this.$post('/v1/workflow/process?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--退货单模型名称 */
export const purchaseManageTHModelName= (_this, data) => {
    return _this.$fetch('/v1/order/buy/return/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--退货单状态更新 */
export const purchaseManageTHUpdate= (_this, data) => {
    return _this.$post('/v1/order/buy/return/status-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--我发起的任务列表 */
export const myLaunchTaskApi= (_this, data) => {
    return _this.$post('/v1/workflow/my-create-task?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--我已办的任务列表 */
export const myHasDoneTaskApi= (_this, data) => {
    return _this.$post('/v1/workflow/my-processed-task?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--我代办的任务列表 */
export const myLTodoTaskApi= (_this, data) => {
    return _this.$post('/v1/workflow/my-todo-task?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--我全部任务类型 */
export const myAllTaskTypes= (_this, data) => {
    return _this.$post('/v1/workflow/all-task-order-type?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--采购供应链查询 */
export const purchaseApplyQueryList= (_this, data) => {
    return _this.$post('/v1/order/buy/supplier/batch-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--采购供应链切换 */
export const purchaseApplySwitch= (_this, data) => {
    return _this.$post('/v1/order/buy/supplier/change-supplier?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块采购管理--采购供应链模糊查询 */
export const purchaseApplyFuzzySearch= (_this, data) => {
    return _this.$post('/v1/order/buy/supplier/blurry-search?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const purchaseManageCheckTaskCreater = (_this, data) => {
    return _this.$fetch('/v1/workflow/is-task-creater?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const allContractList = (_this, data) => {
    return _this.$post('/v1/order/order/goods-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const confirmHasRrelatedApi = (_this, data) => {
    return _this.$post('/v1/order/sell/refund/verify-finish?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购模块——采购策略表*/
export const apiGetPurchaseStrategyList = (_this, data) => {
    return _this.$post('/v1/supply/purchase/strategy-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购模块——采购策略明细导出*/
export const apiGetPurchaseStrategyExport = (_this, data) => {
    return _this.$post('/v1/supply/purchase/strategy-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
/*采购模块——采购策略导入模板下载*/
export const apiGetPurchaseExportTemplate = (_this, data) => {
    return _this.$post('/v1/supply/purchase/export-template?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
/*采购模块——采购策略导入*/
export const apiGetPurchaseStrategyImport = (_this, data) => {
    return _this.$post('/v1/supply/purchase/strategy-import?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购模块——采购策略失败数据导出*/
export const apiGetPurchaseStrategyErrorExport = (_this, data) => {
    return _this.$post('/v1/supply/purchase/error-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
/*采购模块——带权限控制供应商列表*/
export const apiGetPurchaseSupplierAll = (_this, data) => {
    return _this.$post('/v1/supply/supplier/purchase-supplier-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/*采购模块——产品负责人——产品明细*/
export const apiGetPurchaseProductUserList = (_this, data) => {
    return _this.$post('/v1/supply/purchase/product-user-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购模块——产品负责人——产品明细*/
export const apiGetPurchaseGoodsUserList = (_this, data) => {
    return _this.$post('/v1/supply/purchase/goods-user-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购模块——产品负责人——负责人分配*/
export const apiGetPurchaseProductUserAssign = (_this, data) => {
    return _this.$post('/v1/supply/purchase/produc-user-assign?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购模块——商品采购咨询——待确认明细*/
export const apiGetPurchaseToConfirmOrder = (_this, data) => {
    return _this.$post('/v1/supply/purchase/to-confirm-order-product?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购模块——商品采购咨询——待确认明细——确认完成*/
export const apiGetPurchaseConfirmOrder = (_this, data) => {
    return _this.$post('/v1/supply/purchase/confirm-order-product?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购模块——采购策略批量删除*/
export const apiGetPurchaseBulkDelete = (_this, data) => {
    return _this.$post('/v1/supply/purchase/delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//采购--结束
//财务--开始
export const addFinanceRefund = (_this, data) => {
    return _this.$post('/v1/order/finance/refund/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiFinanceRefundList = (_this, data) => {
    return _this.$post('/v1/order/finance/refund/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiFinanceRefundDetail = (_this, data) => {
    return _this.$fetch('/v1/order/finance/refund/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiFinanceRefundDetailUpdate = (_this, data) => {
    return _this.$post('/v1/order/finance/refund/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiFinanceRefundDetailDelete = (_this, data) => {
    return _this.$post('/v1/order/finance/refund/delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 获取财务收款单列表导出--财务 */
export const apiReceiptExport = (_this, data) => {
    return _this.$post('/v1/order/finance/receipt/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 导出采购合同单明细列表 */
export const apiExportPurchaseHtList = (_this, data) => {
    return _this.$post('/v1/order/buy/main/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 导出采购合同单列表 */
export const apiExportPurchaseHtHomeList = (_this, data) => {
    return _this.$post('/v1/order/buy/main/export-index?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};


/* 导出采购发货单*/
export const apiExportShipList = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 导出采购付款单*/
export const apiExportPurchaseFKList = (_this, data) => {
    return _this.$post('/v1/order/buy/pay/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 导出采购收票单*/
export const apiExportPurchaseSPList = (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 导出采购收票单*/
export const apiExportPurchaseSPIndexList = (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/index-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 导出采购入库单*/
export const apiExportInstockList = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 获取财务退款单列表导出--财务 */
export const apiRefundExport = (_this, data) => {
    return _this.$post('/v1/order/finance/refund/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};


/* 获取违约扣款单列表导出--财务 */
export const apiDeductExport = (_this, data) => {
    return _this.$post('/v1/order/finance/deduct/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};


export const apiFinanceRefundDetailEdit = (_this, data) => {
    return _this.$post('/v1/order/finance/refund/edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiFinanceRefundModalName = (_this, data) => {
    return _this.$fetch('/v1/order/finance/refund/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const addBreakRefund = (_this, data) => {
    return _this.$post('/v1/order/finance/deduct/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiBreakRefundList = (_this, data) => {
    return _this.$post('/v1/order/finance/deduct/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiBreakRefundDetail = (_this, data) => {
    return _this.$fetch('/v1/order/finance/deduct/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiBreakRefundDetailUpdate = (_this, data) => {
    return _this.$post('/v1/order/finance/deduct/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiBreakRefundDetailDelete = (_this, data) => {
    return _this.$post('/v1/order/finance/deduct/delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiBreakRefundDetailEdit = (_this, data) => {
    return _this.$post('/v1/order/finance/deduct/edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiBreakRefundModalName = (_this, data) => {
    return _this.$fetch('/v1/order/finance/deduct/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiGetCustomerRemain = (_this, data) => {
    return _this.$fetch('/v1/customers/customer/account?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//财务--结束
// 仓库开始
// 仓库列表
export const apiGetAllStorageList = (_this, data) => {
    return _this.$fetch('/v1/store/store/store-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 新增仓库
export const apiAddNewStorage = (_this, data) => {
    return _this.$post('/v1/store/store/store-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 修改仓库
export const apiEditStorage = (_this, data) => {
    return _this.$post('v1/store/store/store-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 仓库删除
export const apiDeleteStorage = (_this, data) => {
    return _this.$fetch('/v1/store/store/store-del?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 库区列表
export const apiGetAllAreaList = (_this, data) => {
    return _this.$fetch('/v1/store/store/area-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 新增库区
export const apiAddNewArea = (_this, data) => {
    return _this.$post('/v1/store/store/area-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 修改库区
export const apiEditArea = (_this, data) => {
    return _this.$post('v1/store/store/area-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 库区删除
export const apiDeleteArea = (_this, data) => {
    return _this.$fetch('/v1/store/store/area-del?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 库位列表
export const apiGetAllSeatList = (_this, data) => {
    return _this.$fetch('/v1/store/store/seat-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 新增库位
export const apiAddNewSeat = (_this, data) => {
    return _this.$post('/v1/store/store/seat-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 修改库位
export const apiEditSeat = (_this, data) => {
    return _this.$post('v1/store/store/seat-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 库位删除
export const apiDeleteSeat = (_this, data) => {
    return _this.$fetch('/v1/store/store/seat-del?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 库区/库位启用
export const apiActiveAreaSeat = (_this, data) => {
    return _this.$post('/v1/store/store/disable-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//
export const getAllGoodsSeats = (_this, data) => {
    return _this.$post('/v1/store/goods-seat/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiExportSeatTmp = (_this, data) => {
    return _this.$post('/v1/store/goods-seat/export-template?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
export const apiExportModelTmp = (_this, data) => {
    return _this.$post('/v1/product/goods/export-template?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
export const apiExportProductTmp = (_this, data) => {
    return _this.$post('/v1/product/goods/export-template-product?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
export const apiExportSeatsTable = (_this, data) => {
    return _this.$post('/v1/store/goods-seat/export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
//
export const apiImportSeats = (_this, data) => {
    return _this.$post('/v1/store/goods-seat/import?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiImportModel = (_this, data) => {
    return _this.$post('/v1/product/goods/import?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiUpdateModel = (_this, data) => {
    return _this.$post('/v1/product/goods/update-model?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//
export const apiAllSupplyList = (_this, data) => {
    return _this.$post('/v1/store/stock/supply-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//库位转移接口
export const apiMoveSupplyList = (_this, data) => {
    return _this.$post('/v1/store/stock/move-store?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiExportSupplyTable = (_this, data) => {
    return _this.$post('/v1/store/stock/supply-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
//
export const apiInStockGoodsList = (_this, data) => {
    return _this.$post('/v1/store/stock/in-stock-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//
export const apiExportInStockTable = (_this, data) => {
    return _this.$post('/v1/store/stock/in-stock-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
//
export const apiOutStockGoodsList = (_this, data) => {
    return _this.$post('/v1/store/stock/out-stock-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//
export const apiExportOutStockTable = (_this, data) => {
    return _this.$post('/v1/store/stock/out-stock-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
//
export const apiExportFailedLocation = (_this, data) => {
    return _this.$post('/v1/store/goods-seat/error-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
export const apiExportFailedproduct = (_this, data) => {
    return _this.$post('/v1/product/goods/error-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
export const apiExportFailedModel = (_this, data) => {
    return _this.$post('/v1/product/goods/error-export-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
//合作地址列表
export const apiGetSupplyCoAddress = (_this, data) => {
    return _this.$fetch('/v1/supply/supplier/address-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作地址添加
export const apiAddSupplyCoAddress = (_this, data) => {
    return _this.$post('/v1/supply/supplier/address-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作地址修改
export const apiEditSupplyCoAddress = (_this, data) => {
    return _this.$post('/v1/supply/supplier/address-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作地址删除
export const apiDeleteSupplyCoAddress = (_this, data) => {
    return _this.$post('/v1/supply/supplier/address-delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌列表
export const apiGetSupplyCoBrand = (_this, data) => {
    return _this.$fetch('/v1/supply/supplier/brand-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌新增
export const apiAddSupplyCoBrand = (_this, data) => {
    return _this.$post('/v1/supply/supplier/brand-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌产品线
export const apiSupplyCoBrandProduct = (_this, data) => {
    return _this.$post('/v1/supply/supplier/product-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌修改
export const apiEditSupplyCoBrand = (_this, data) => {
    return _this.$post('/v1/supply/supplier/brand-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌待添加
export const apiGetSupplyCoBrandToAddGoods = (_this, data) => {
    return _this.$post('/v1/supply/supplier/no-product-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌添加
export const apiGetSupplyCoBrandAddGoods = (_this, data) => {
    return _this.$post('/v1/supply/supplier/product-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌优先级
export const apiGetSupplyProductPriority = (_this, data) => {
    return _this.$fetch('/v1/supply/supplier/product-priority-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌优先级修改
export const apiEditSupplyProductPriority = (_this, data) => {
    return _this.$post('/v1/supply/supplier/product-priority-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌产品修改
export const apiEditSupplyProductEdit = (_this, data) => {
    return _this.$post('/v1/supply/supplier/product-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌产品修改
export const apiSingleSupplyProductDelete = (_this, data) => {
    return _this.$post('/v1/supply/supplier/product-delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌删除
export const apiDeleteSupplyBrand = (_this, data) => {
    return _this.$post('/v1/supply/supplier/brand-delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
}
//合作品牌内容
export const apiGetSupplyContent = (_this, data) => {
    return _this.$fetch('/v1/supply/supplier/agree-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
//合作品牌内容修改
export const apiEditSupplyContent = (_this, data) => {
    return _this.$post('/v1/supply/supplier/agree-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
             return res;
        }
    });
};
// 仓库结束



/*==采购角色===*/
/*全量供应商列表接口*/
export const apiGetPurchaseSupplierList = (_this, data) => {
    return _this.$post('/v1/supply/supplier/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*仓库列表*/
export const apiGetCommonStockList = (_this, data) => {
    return _this.$post('/common/stores?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购备货单明细列表接口*/
export const apiGetPurchaseBhList = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


/*采购备货单列表接口*/
export const apiGetPurchaseBhListBackup = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/backup-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/*采购供应链管理供应商分析列表接口*/
export const apiGetPurchaseSupplyAnalyseList = (_this, data) => {
    return _this.$post('/v1/supply/supplier/supplier-analysis-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/*采购供应链管理供应商分析列表导出接口*/
export const apiGetPurchaseSupplyAnalyseListExport = (_this, data) => {
    return _this.$post('/v1/supply/supplier/supplier-analysis-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/*采购备货单明细列表导出接口*/
export const apiGetPurchaseBhListExport = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/list-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/*采购备货单列表导出接口*/
export const apiGetPurchaseBhListBackupExport = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/backup-list-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/*采购备货单列表详情接口*/
export const apiGetPurchaseBackupDetail = (_this, data) => {
    return _this.$fetch('/v1/order/buy/backup/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购备货单列表详情接基本信息修改*/
export const apiGetPurchaseBackupEditBasic = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/edit-basic?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购备货单列表详情接商品信息修改*/
export const apiGetPurchaseBackupEditDetail = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/edit-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购备货单批量添加*/
export const apiGetPurchaseBackupSearch = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/search-product?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/*采购备货单模糊查询*/
export const apiVagueSearch = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/vague-search?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/*采购备货单添加保存*/
export const apiGetPurchaseBackupAdd = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购备货单删除*/
export const apiGetPurchaseBackupDelete = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购备货单状态更新*/
export const apiGetPurchaseBackupUpdateStatus = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

export const apiGetPurchaseHtAdd = (_this, data) => {
    return _this.$post('/v1/order/buy/main/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购员重分配*/
export const apiGetPurchaseWorkerAssign = (_this, data) => {
    return _this.$post('/v1/order/buy/main/buyer-assign?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购合同单明细列表接口*/
export const apiGetPurchaseHtList = (_this, data) => {
    return _this.$post('/v1/order/buy/main/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购合同单列表接口*/
export const apiGetPurchaseHtHomeList = (_this, data) => {
    return _this.$post('/v1/order/buy/main/home-index?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/*采购合同单详情接口*/
export const apiGetPurchaseHtDetail = (_this, data) => {
    return _this.$fetch('/v1/order/buy/main/buyorder-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


/**
 * 销售合同单基本信息导出（客服）
 */
export const apiGetPurchaseHtDetailExport = (_this, data) => {
    return _this.$fetch('/v1/order/buy/main/buyorder-detail-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};


/*采购合同单详情删除*/
export const apiGetPurchaseHtDelete = (_this, data) => {
    return _this.$fetch('/v1/order/buy/main/buyorder-delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购合同单详情修改*/
export const apiGetPurchaseHtEdit = (_this, data) => {
    return _this.$post('/v1/order/buy/main/info-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购合同单详情合同信息修改*/
export const apiGetPurchaseHtAttachEdit = (_this, data) => {
    return _this.$post('/v1/order/buy/main/upload-attach?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购合同单详情修改*/
export const apiGetPurchaseHtGoodsDetailEdit = (_this, data) => {
    return _this.$post('/v1/order/buy/main/detail-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购合同单详情生成 发货单*/
export const apiGetPurchaseHtShipGenerate = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/generate?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*新增采购合同单列表接口*/
export const apiGetPurchaseReadybuyList = (_this, data) => {
    return _this.$post('/v1/order/buy/main/readybuy-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/*新增采购合同单列表导出接口*/
export const apiGetPurchaseReadybuyListExport = (_this, data) => {
    return _this.$post('/v1/order/buy/main/readybuy-list-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};


/*新增采购合同单物料明细接口*/
export const apiGetPurchaseReadybuydetail = (_this, data) => {
    return _this.$post('/v1/order/buy/main/readybuy-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同修改单列表接口 */
export const apiGetPurchaseHTeditList = (_this, data) => {
    return _this.$post('/v1/order/buy/change/change-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同修改单详情接口 */
export const apiGetPurchaseHTeditDetail = (_this, data) => {
    return _this.$post('/v1/order/buy/change/change-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同修改单详情合同信息修改接口 */
export const apiGetPurchaseHTeditChangeDetail = (_this, data) => {
    return _this.$post('/v1/order/buy/change/contract-modify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 采购合同修改单详情基本信息修改接口 */
export const apiGetPurchaseHTeditBasicUpdate = (_this, data) => {
    return _this.$post('/v1/order/buy/change/basic-update?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 采购合同修改单详情商品信息修改接口 */
export const apiGetPurchaseHTeditProductModify = (_this, data) => {
    return _this.$post('/v1/order/buy/change/product-modify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同修改单详情合同信息删除接口 */
export const apiGetPurchaseHTeditDelChange = (_this, data) => {
    return _this.$post('/v1/order/buy/change/deleted-change?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同修改单详情合同信息状态接口 */
export const apiGetPurchaseHTeditStatusUpdate = (_this, data) => {
    return _this.$post('/v1/order/buy/change/status-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 采购合同详情付款信息 */
export const apiGetPurchaseHTDetailPay = (_this, data) => {
    return _this.$post('/v1/order/buy/main/get-pay-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同详情收票信息 */
export const apiGetPurchaseHTDetailInvoice = (_this, data) => {
    return _this.$fetch('/v1/order/buy/main/get-invoice?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同详情发货信息 */
export const apiGetPurchaseHTDetailShip = (_this, data) => {
    return _this.$fetch('/v1/order/buy/main/ship-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同详情修改信息 */
export const apiGetPurchaseHTDetailEdit = (_this, data) => {
    return _this.$post('/v1/order/buy/main/edit-details?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同详情退货信息 */
export const apiGetPurchaseHTDetailReturn = (_this, data) => {
    return _this.$post('/v1/order/buy/main/return-details?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 采购合同详情合同修改单生成 */
export const apiGetPurchaseHTeditAddChange = (_this, data) => {
    return _this.$post('/v1/order/buy/change/add-change?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同详情付款单生成 */
export const apiGetPurchaseHTPayAdd = (_this, data) => {
    return _this.$post('/v1/order/buy/pay/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同单详情状态更新 */
export const apiGetPurchaseHTStatusChange = (_this, data) => {
    return _this.$post('/v1/order/buy/main/buyorder-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块供应商管理--供应商列表 */
export const purchaseApplyList = (_this, data) => {
    return _this.$post('/v1/supply/supplier/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购模块供应商管理--供应商新增 */
export const purchaseAddApply = (_this, data) => {
    return _this.$post('/v1/supply/supplier/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购付款单详情接口 */
export const apiGetPurchaseFKList = (_this, data) => {
    return _this.$post('/v1/order/buy/pay/buypay-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购发货单列表数据 */
export const apiGetShipList = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 采购发货单添加商品 */
export const apiGetPurchaseCanShip = (_this, data) => {
    return _this.$post('/v1/order/buy/main/can-ship-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货单基本信息修改 */
export const apiModifyShipInfo = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/modify-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货单获取入库单单据编号 */
export const apiGetInstockByShip = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/getinstock?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货单详情数据 */
export const apiGetShipDetail = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货单详情导出数据 */
export const apiGetShipDetailExport = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/detail-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
/* 采购发货单作废接口 */
export const apiGetShipAbolish = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/abolish?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 采购发货单提交接口 */
export const apiGetShipSubmit = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/submit?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/*采购付款单详情接口*/
export const apiGetPurchaseFKDetail = (_this, data) => {
    return _this.$post('/v1/order/buy/pay/paydetail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 待生成采购发货单接口 */
export const apiWaitShipList = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/waitlist?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货单是否可点击直发接口 */
export const apiShipIsDirect = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/isdirect?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 采购发货单产品明细修改 */
export const apiShipProductEdit = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/product-edit?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 采购发货单删除 */
export const apiShipOrderDeleted = (_this, data) => {
    return _this.$fetch('/v1/order/buy/ship/deleted?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货修改单待生成列表 */
export const apiPurchaseShipEditToList = (_this, data) => {
    return _this.$post('/v1/order/buy/shipmodify/wait-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 生成采购发货修改单 */
export const apiPurchaseShipEditMake = (_this, data) => {
    return _this.$post('/v1/order/buy/shipmodify/generate?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货修改单列表 */
export const apiPurchaseShipModifyList = (_this, data) => {
    return _this.$post('/v1/order/buy/shipmodify/list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货修改单详情 */
export const apiPurchaseShipModifyDetail = (_this, data) => {
    return _this.$post('/v1/order/buy/shipmodify/detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货修改单删除 */
export const apiPurchaseShipModifyDelete = (_this, data) => {
    return _this.$post('/v1/order/buy/shipmodify/delete?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货修改单基本信息修改 */
export const apiPurchaseShipModifyBasic = (_this, data) => {
    return _this.$post('/v1/order/buy/shipmodify/modify-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货修改单商品明细修改 */
export const apiPurchaseShipModifyGoods= (_this, data) => {
    return _this.$post('/v1/order/buy/shipmodify/modify-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购发货修改单提交 */
export const apiPurchaseShipModifySubmit= (_this, data) => {
    return _this.$post('/v1/order/buy/shipmodify/submit?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 根据到货仓库编号获取到货仓库详细地址 */
export const apiGetCkDetailByCKBH = (_this, data) => {
    return _this.$post('/v1/order/buy/ship/address-by-store?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 采购退款单列表 */
export const apiGetPurchaseReturnPayList = (_this, data) => {
    return _this.$post('/v1/order/buy/returnpay/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 采购退款单详情 */
export const apiGetPurchaseReturnPayDetail = (_this, data) => {
    return _this.$fetch('/v1/order/buy/returnpay/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 更新采购退款单状态 */
export const apiGetPurchaseReturnPayUpdateStatus = (_this, data) => {
    return _this.$post('/v1/order/buy/returnpay/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购退款单待新增数据[采购修改单] */
export const apiGetPurchaseReturnPayReadyByChange = (_this, data) => {
    return _this.$fetch('/v1/order/buy/returnpay/ready-bychange?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 采购退款单待新增数据[采购退货单] */
export const apiGetPurchaseReturnPayReadyByReturn = (_this, data) => {
    return _this.$fetch('/v1/order/buy/returnpay/ready-byreturn?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 更新采购退款单状态 */
export const apiGetPurchaseAddReturnPay = (_this, data) => {
    return _this.$post('/v1/order/buy/returnpay/add-returnpay?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购入库单列表接口 */
export const apiInstockList = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购入库单详情接口 */
export const apiInstockDetail = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购入库单详情接口 */
export const apiInstockModifyInfo = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/modify-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/* 采购入库单添加商品 */
export const apiInstockAddProduct = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/add-product?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};


/*采购付款单删除*/
export const apiDeleteFKOrder = (_this, data) => {
    return _this.$post('v1/order/buy/pay/del?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/*采购付款单更新状态*/
export const apiUpdateStatusFK = (_this, data) => {
    return _this.$post('v1/order/buy/pay/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/*采购付款单更新单据信息*/
export const apiUpdateInfoFK = (_this, data) => {
    return _this.$post('v1/order/buy/pay/update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/*采购付款单更新单据信息*/
export const apiGetgenerateInvoice = (_this, data) => {
    return _this.$post('v1/order/buy/invoice/generate-invoice?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/*采购收票单明细列表明细新增商品数据*/ 
export const apiGetAddInvoice = (_this, data) => {
    return _this.$post('v1/order/buy/invoice/add-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


/* 采购入库单详情列表修改接口 */
export const apiInstockModifyList = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/modify-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购入库单删除接口 */
export const apiInstockDelete = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/delete?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购入库单提交接口 */
export const apiInstockSubmit = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/submit?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购入库单作废接口 */
export const apiInstockAbolish = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/abolish?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 获取采购入库单模型名称 */
export const apiGetInstockModelName = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/model-name?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购收票单新增接口 */
export const apiaddSP = (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/add-invoice?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 待生成采购入库单列表 */
export const apiInstockWaitList = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/waitlist?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 生成采购入库单接口 */
export const apiGenerateInstock = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/generate?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 采购退票单新增接口 */
export const apiaddTP = (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/add-backinvoice?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 采购备货单模型名称接口 */
export const apiInBackupName = (_this, data) => {
    return _this.$fetch('/v1/order/buy/backup/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购备货单模型名称接口 */
export const apiInMainName = (_this, data) => {
    return _this.$fetch('/v1/order/buy/main/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购备货单模型名称接口 */
export const apiInPayName = (_this, data) => {
    return _this.$fetch('/v1/order/buy/pay/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购合同修改单模型名称接口 */
export const apiInChangeName = (_this, data) => {
    return _this.$fetch('/v1/order/buy/change/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 采购入库单回退接口 */
export const apiInstockBack = (_this, data) => {
    return _this.$post('/v1/order/buy/instock/back?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 获取采购付款单模型名称 */
export const apiGetPayModelName = (_this, data) => {
    return _this.$post('/v1/order/buy/pay/model-name?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 更新支付凭证 */
export const apiUpdatepPayIdentityFK = (_this, data) => {
    return _this.$post('/v1/order/buy/pay/update-pay-identity?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 出库单出库接口 */
export const purchaseManageDoOutput = (_this, data) => {
    return _this.$post('/v1/order/buy/outstock/out?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 获取采购付款单待付金额 */
export const purchaseManageReadyPayMoney = (_this, data) => {
    return _this.$fetch('/v1/order/buy/pay/ready-amount?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 获取采购负责人列表 */
export const purchaseCpPartyList = (_this, data) => {
    return _this.$post('/v1/order/buy/product-party/list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 删除采购负责人 */
export const purchaseCpPartyDelete = (_this, data) => {
    return _this.$post('/v1/order/buy/product-party/delete?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 新增和修改采购负责人 */
export const purchaseCpPartyAdd = (_this, data) => {
    return _this.$post('/v1/order/buy/product-party/add?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 获取角色所属员工 */
export const purchaseGetSales = (_this, data) => {
    return _this.$post('/v1/order/buy/product-party/get-sales?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 获取销售请购修改单列表 */
export const saleManageRequisitionEditList = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition-edit/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 获取销售请购修改单详情 */
export const saleManageRequisitionEditDetail = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition-edit/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 修改销售请购修改单基本信息 */
export const apiRequisitionEditDetailUpdateInfo = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition-edit/edit-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 修改销售请购修改单明细 */
export const apiRequisitionEditDetailUpdateDetail = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition-edit/edit-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 删除销售请购修改单 */
export const apiRequisitionEditDel = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition-edit/delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 更新销售请购修改单状态 */
export const apiRequisitionEditUpdateStatus = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition-edit/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 销售请购单模型名称 */
export const apiRequisitionModalName = (_this, data) => {
    return _this.$fetch('/v1/order/sell/requisition/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};



/* 获取销售请购单明细id对应的单据信息 */
export const apiOrderShipInfo = (_this, data) => {
    return _this.$fetch('/v1/order/sell/requisition/get-ship-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 获取销售请购单明细id对应的单据信息 */
export const apiOrderInstockInfo = (_this, data) => {
    return _this.$fetch('/v1/order/sell/requisition/get-instock-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 获取销售请购单明细id对应的销售出库单单据信息 */
export const apiOrderCkInfo = (_this, data) => {
    return _this.$fetch('/v1/order/sell/requisition/get-ck-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 获取销售请购单明细id对应的采购合同单单据信息 */
export const apiOrderBuyInfo = (_this, data) => {
    return _this.$fetch('/v1/order/sell/requisition/get-buy-info?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 销售出库单基本信息修改 */
export const apiServiceXsckdInfoEdit = (_this, data) => {
    return _this.$post('/v1/order/out-bound/edit-base?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 销售请购单详情 */
export const apiRequisitionDetail = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 销售请购修改单新增 */
export const apiRequisitionEditAdd = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition-edit/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 销售请购单列表 */
export const purchaseManageRequisitionList = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 销售请购单明细列表 */
export const purchaseManageRequisitionDetailList = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/detail-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 销售请购单明细列表导出 */
export const purchaseManageRequisitionDetailListExport = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/detail-list-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 销售请购单基本信息修改 */
export const purchaseManagesalesRequiritionBasicEdit = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/edit?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 获取所有采购员 */
export const allpersonInfos = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/all-buy?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 销售请购单商品信息修改 */
export const purchaseManagesalesRequiritionEdit = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/product-edit?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 待请购列表 */
export const purchaseManagesalesRequiritionReadyList = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/ready-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 请购单删除 */
export const purchaseManageRequisitionDelete = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/delete?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 销售请购单模型名称 */
export const purchaseManageQGModelName= (_this, data) => {
    return _this.$fetch('/v1/order/sell/requisition/model-name?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 销售请购单模型名称 */
export const purchaseManageRequisitionUpdate= (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/update-status?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 待请购商品明细 */
export const purchaseManagesalesRequiritionReadyListtDetail= (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/ready-list-detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 添加请购单*/
export const purchaseManagesalesRequiritionAdd= (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/add?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 获取销售请购修改单模型名称 */
export const apiGetqgxgdModelName = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition-edit/model-name?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};

/* 获取财务收款单列表--财务 */
export const apiGetFinanceReceiptList = (_this, data) => {
    return _this.$post('/v1/order/finance/receipt/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 获取财务收款单详情--财务 */
export const apiGetFinanceReceiptDetail = (_this, data) => {
    return _this.$fetch('/v1/order/finance/receipt/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 获取财务收款单作废--财务 */
export const apiGetFinanceReceiptInvalid = (_this, data) => {
    return _this.$post('/v1/order/finance/receipt/invalid?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 获取财务收款单新增--财务 */
export const apiGetFinanceReceiptAdd = (_this, data) => {
    return _this.$post('/v1/order/finance/receipt/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 获取财务收款单收款银行--财务 */
export const apiGetFinanceReceiptBank = (_this, data) => {
    return _this.$fetch('/v1/order/finance/funds/get-receipt-bank?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 获取客户资金池--财务 */
export const apiGetFinanceFundsList = (_this, data) => {
    return _this.$post('/v1/order/finance/funds/customer-account-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 客户资金池导出--财务 */
export const apiExportFinanceFunds = (_this, data) => {
    return _this.$post('/v1/order/finance/funds/customer-account-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 客户资金池明细导出--财务 */
export const apiExportFundsDetail = (_this, data) => {
    return _this.$post('/v1/order/finance/funds/funds-detail-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 获取客户资金池--财务 */
export const apiGetFinanceFundsDetailList = (_this, data) => {
    return _this.$post('/v1/order/finance/funds/funds-detail-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 获取所有客户--财务 */
export const apiGetFinanceAllkh = (_this, data) => {
    return _this.$fetch('/v1/order/finance/receipt/kh?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 获取所有客户--财务 */
export const apiGetFinanceReceiptType = (_this, data) => {
    return _this.$fetch('/v1/order/finance/funds/receipt-type-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 库存同步列表--运营 */
export const apiGetSupplierStock = (_this, data) => {
    return _this.$post('/v1/risk/statistics/supplier-stock?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 库存同步启用禁用--运营 */
export const apiGetSupplierStockUse = (_this, data) => {
    return _this.$post('/v1/risk/statistics/supplier-stock-use?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 库存同步删除--运营 */
export const apiGetSupplierStockDelete = (_this, data) => {
    return _this.$post('/v1/risk/statistics/supplier-stock-delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 商品批量查询--运营 */
export const apiGetOperateSearchGoods = (_this, data) => {
    return _this.$post('/v1/product/goods/search-goods?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 商品批量查询--运营 */
export const apiGetOperateGoodsUpdate = (_this, data) => {
    return _this.$post('/v1/product/goods/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 运费登记单列表--仓库 */
export const apiGetStockFreightList = (_this, data) => {
    return _this.$post('/v1/store/freight/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 仓库列表--仓库 */
export const apiGetStockStoreList = (_this, data) => {
    return _this.$fetch('/v1/store/store/store-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 运费登记单列表导出--仓库 */
export const apiGetStockFreightExport = (_this, data) => {
    return _this.$post('/v1/store/freight/export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
/* 运费登记单列表删除--仓库 */
export const apiStockFreightDelete = (_this, data) => {
    return _this.$post('/v1/store/freight/delete-all?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 运费登记单待登记列表--仓库 */
export const apiGetStockNeedFreight = (_this, data) => {
    return _this.$post('/v1/store/freight/need-freight?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 运费登记单新增--仓库 */
export const apiGetStockAddFreight = (_this, data) => {
    return _this.$post('/v1/store/freight/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
export const apiGetStockInventoryProfitList = (_this, data) => {
    return _this.$post('/v1/store/inventory-profit/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘亏出库单列表--仓库 */
export const apiGetStockInventoryLossList = (_this, data) => {
    return _this.$post('/v1/store/inventory-loss/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘亏出库单详情--仓库 */
export const apiGetStockInventoryLossDetail= (_this, data) => {
    return _this.$fetch('/v1/store/inventory-loss/details?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘亏出库单基本信息修改--仓库 */
export const apiGetStockInventoryLossBasicEdit = (_this, data) => {
    return _this.$post('/v1/store/inventory-loss/basic-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘亏出库单商品明细修改--仓库 */
export const apiGetStockInventoryLossProEdit = (_this, data) => {
    return _this.$post('/v1/store/inventory-loss/product-edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘亏出库单删除--仓库 */
export const apiGetStockInventoryLossDeleted = (_this, data) => {
    return _this.$fetch('/v1/store/inventory-loss/deleted?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘亏出库单待出库数据--仓库 */
export const apiGetStockInventoryLossReady = (_this, data) => {
    return _this.$post('/v1/store/inventory-loss/ready-loss?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘亏出库单新增--仓库 */
export const apiGetStockInventoryLossAdd = (_this, data) => {
    return _this.$post('/v1/store/inventory-loss/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}
/* 盘亏出库单新增--仓库 */
export const apiGetStockInventoryLossStatus = (_this, data) => {
    return _this.$post('/v1/store/inventory-loss/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
}

/* 盘盈入库单详情--仓库 */
export const apiGetStockInventoryProfitDetail = (_this, data) => {
    return _this.$fetch('/v1/store/inventory-profit/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘盈入库单详情基本信息修改--仓库 */
export const apiGetStockInventoryProfitInfo = (_this, data) => {
    return _this.$post('/v1/store/inventory-profit/update-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘盈入库单详情商品明细修改--仓库 */
export const apiGetStockInventoryProfitDetailUpdate = (_this, data) => {
    return _this.$post('/v1/store/inventory-profit/update-details?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘盈入库单详情批量添加--仓库 */
export const apiGetStockInventoryProfitBeforeAdd = (_this, data) => {
    return _this.$post('/v1/store/inventory-profit/before-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘盈入库单新增--仓库 */
export const apiGetStockInventoryProfitAdd= (_this, data) => {
    return _this.$post('/v1/store/inventory-profit/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘盈入库单删除--仓库 */
export const apiGetStockInventoryProfitDel= (_this, data) => {
    return _this.$fetch('/v1/store/inventory-profit/del?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘盈入库单状态更新--仓库 */
export const apiGetStockInventoryProfitStatus = (_this, data) => {
    return _this.$post('/v1/store/inventory-profit/status-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘盈入库单导出--仓库 */
export const apiGetStockInventoryProfitExport = (_this, data) => {
    return _this.$post('/v1/store/inventory-profit/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};
/* 盘亏出库单导出--仓库 */
export const apiGetStockInventoryLossExport = (_this, data) => {
    return _this.$post('/v1/store/inventory-loss/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};
/* 盘亏出库单模型名称--仓库 */
export const apiGetStockInventoryLossModel = (_this, data) => {
    return _this.$fetch('/v1/store/inventory-loss/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 盘盈入库单模型名称--仓库 */
export const apiGetStockInventoryProfitModel = (_this, data) => {
    return _this.$post('/v1/store/inventory-profit/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 待生成开票*/
export const apiGetDataToMakeInvoice = (_this, data) => {
    return _this.$fetch('/v1/order/sell/invoice/wait-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 添加待开票*/
export const apiGetDataToAddInvoice = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/add-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 保存待开票*/
export const apiGetDataToSaveInvoice = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/invoice-save?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 待生成开票抬头*/
export const apiGetDataOfInvoice = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/invoice-title-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 待生成开票详情*/
export const apiGetDataOfInvoiceDetail = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/invoice-title-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 待生成开票明细*/
export const apiGetInvoiceToMakeData = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/to-invoice-item?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 待生成开票明细导出*/
export const apiExportInvoiceToMakeData = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/to-invoice-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
/* 客户信息——收票地址--客服 */
export const apiGetServiceInvoiceAdress = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/get-invoice-address?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 客户信息——收票地址新增/修改--客服 */
export const apiGetServiceInvoiceAddrModify = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/modify-invoice-address?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 客户信息——收票地址新增/修改--客服 */
export const apiGetServiceInvoiceAddrSetDefault = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/set-default?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 客户信息——收票地址删除--客服 */
export const apiGetServiceInvoiceAddrDel = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/del?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 客户信息——待开票列表--客服 */
export const apiGetServiceInvoiceItem = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/to-invoice-item?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 客户信息——待开票列表校验--客服 */
export const apiGetServiceInvoiceVerify = (_this, data) => {
    return _this.$fetch('/v1/order/sell/invoice/verify-ids?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


/*销售开票单导出 --liebiao*/
export const apiInvoiceExportList = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/list-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/*销售开票单明细导出 --liebiao*/
export const apiInvoiceExportDetailList = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/detail-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};
/*销售开票单运费导出 --liebiao*/
export const apiInvoiceExportShipList = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/ship-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/*销售开票单导出*/
export const apiInvoiceExport = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res,true);
    }
});
};

/*盘盈入库单/盘亏出库单打印*/
export const apiInventoryPrint = (_this, data) => {
    return _this.$post('/model/index?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/*是否打印销售出库单面单*/
export const apiServiceOutBoundPrint = (_this, data) => {
    return _this.$fetch('/v1/order/out-bound/can-print-shipping?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*发货物流*/
export const apiSendLogistic = (_this, data) => {
    return _this.$fetch('/common/fhwl-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};

/* 产品批量删除 */
export const apiGetProductSeriesDeleted = (_this, data) => {
    return _this.$post('/v1/product/products/deleted?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return res;
    }
});
};
/* 风控模块销售风控 */
export const apiGetWindControlSell = (_this, data) => {
    return _this.$post('/v1/risk/statistics/sell?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/* 风控模块销售风控导出 */
export const apiGetWindControlSellOut = (_this, data) => {
    return _this.$post('/v1/risk/statistics/sell-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return browserDwon(res);
            }
        });
};
/* 风控模块采购风控 */
export const apiGetWindControlBuy = (_this, data) => {
    return _this.$post('/v1/risk/statistics/buy?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/* 风控模块采购风控导出 */
export const apiGetWindControlBuyOut = (_this, data) => {
    return _this.$post('/v1/risk/statistics/buy-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return browserDwon(res);
            }
        });
};
/*系统管理员 组织部门列表*/
export const apiGetManagerDepartList = (_this, data) => {
    return _this.$post('/v1/admin/depart/list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*系统管理员 组织部门详情*/
export const apiGetManagerDepartDetail = (_this, data) => {
    return _this.$fetch('/v1/admin/depart/detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*系统管理员 组织部门修改*/
export const apiGetManagerDepartEdit = (_this, data) => {
    return _this.$post('/v1/admin/depart/edit?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*系统管理员 组织部门新增*/
export const apiGetManagerDepartAdd = (_this, data) => {
    return _this.$post('/v1/admin/depart/add?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*系统管理员 组织部门删除*/
export const apiGetManagerDepartDelete = (_this, data) => {
    return _this.$post('/v1/admin/depart/delete?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*系统管理员 角色权限列表*/
export const apiGetManagerRoleList = (_this, data) => {
    return _this.$post('/v1/admin/role/list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*系统管理员 角色权限详情*/
export const apiGetManagerRoleDetail = (_this, data) => {
    return _this.$fetch('/v1/admin/role/detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*系统管理员 角色权限删除*/
export const apiGetManagerRoleDelete = (_this, data) => {
    return _this.$post('/v1/admin/role/delete?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*系统管理员 角色权限模块树形*/
export const apiGetManagerRoleCategory = (_this, data) => {
    return _this.$fetch('/v1/admin/role/module-category-tree?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*系统管理员 角色权限新增*/
export const apiGetManagerRoleAdd= (_this, data) => {
    return _this.$post('/v1/admin/role/add?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
// swj
/*系统管理员 获取当前角色module_id*/
export const apiGetManagerCurrentModules= (_this, data) => {
    return _this.$post('v1/admin/role/role-modules?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*系统管理员 新增员工*/
export const apiGetManagerAddStaff= (_this, data) => {
    return _this.$post('v1/admin/user/add?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/*系统管理员 获取员工详情*/
export const apiGetManagerStaffDetail= (_this, data) => {
    return _this.$fetch('v1/admin/user/detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
// swj

/*系统管理员 角色权限新增*/
export const apiGetManagerRoleEdit= (_this, data) => {
    return _this.$post('/v1/admin/role/edit?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
                apiLoginOut(_this, {
                    token: setToken()
                });
            } else {
                return res;
            }
        });
};
/* 导出销售合同单列表-客服*/
export const apiExportHtdList = (_this, data) => {
    return _this.$post('/v1/order/order/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 导出合同单明细列表-客服*/
export const exportContractList = (_this, data) => {
    return _this.$post('/v1/order/order/export-detaillist?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 导出销售出库单列表-客服*/
export const exportCkdList = (_this, data) => {
    return _this.$post('/v1/order/out-bound/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};
/* 导出出库单明细列表*/
export const exportXSCKDDetailList = (_this, data) => {
    return _this.$post('/v1/order/out-bound/export-detail-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};
/* 销售出库单明细列表*/
export const apiXsckdMxList = (_this, data) => {
    return _this.$post('/v1/order/out-bound/detail-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 导出销售退货单列表*/
export const exportThdList = (_this, data) => {
    return _this.$post('/v1/order/sell/return/export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 销售退货单明细列表*/
export const apiXsthdMxList = (_this, data) => {
    return _this.$post('/v1/order/sell/return/detail-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 导出退货单明细列表*/
export const exportThdMxList = (_this, data) => {
    return _this.$post('/v1/order/sell/return/export-detail-list?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 导出销售退货单明细*/
export const exportThdDetailNew = (_this, data) => {
    return _this.$post('/v1/order/sell/return/export-detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 导出退货入库单明细*/
export const exportThrkdDetail = (_this, data) => {
    return _this.$post('/v1/order/sell/instock/export-detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};


/* 导出销售开票单明细*/
export const exportXskpdDetail = (_this, data) => {
    return _this.$post('/v1/order/sell/invoice/export-detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 导出采购备货单明细*/
export const exportPurchaseBackupDetail = (_this, data) => {
    return _this.$post('/v1/order/buy/backup/export-detail?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};

/* 出库单明细成本*/
export const apiOutBoundCostList = (_this, data) => {
    return _this.$post('/v1/order/out-bound/cost?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 出库单明细成本导出 */
export const apiOutBoundCostExport = (_this, data) => {
    return _this.$post('/v1/order/out-bound/cost-export?token=' + setToken(), data).then(res => {
            if (res.status === -1) {
        apiLoginOut(_this, {
            token: setToken()
        });
    } else {
        return browserDwon(res);
    }
});
};
/* 获取收票单明细添加商品数据*/
export const apiGetPurchaseSPGoods = (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/add-goods?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
/* 获取所有的客服 */
export const apiGetAllServiceMan= (_this, data) => {
    return _this.$fetch('common/all-service-man?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

/* 获取所有的销售 */
export const apiGetAllSalesman= (_this, data) => {
    return _this.$fetch('common/all-salesman?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//财务收款单模板下载
export const apiExportFinanceModel = (_this, data) => {
    return _this.$post('/v1/order/finance/receipt/export-model?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};
//财务收款单导入
export const apiImporFinanceModel = (_this, data) => {
    return _this.$post('/v1/order/finance/receipt/import?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//财务收款单批量新增
export const apiPatchFinanceReceiptAdd = (_this, data) => {
    return _this.$post('/v1/order/finance/receipt/patch-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//商城模块---轮播图列表--王健
export const mallCarouseListApi = (_this, data) => {
    return _this.$post('/v1/mall/carousel-pic/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//商城模块---轮播图新增--王健
export const mallCarouseAddApi = (_this, data) => {
    return _this.$post('/v1/mall/carousel-pic/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//商城模块---轮播图修改--王健
export const mallCarouseEditApi = (_this, data) => {
    return _this.$post('/v1/mall/carousel-pic/edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//商城模块---轮播图删除--王健
export const mallCarouseDeleteApi = (_this, data) => {
    return _this.$fetch('/v1/mall/carousel-pic/deleted?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


//商城模块---轮播图列表--王健
export const mallActivityListApi = (_this, data) => {
    return _this.$post('/v1/mall/recommend/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//商城模块---轮播图新增--王健
export const mallActivityAddApi = (_this, data) => {
    return _this.$post('/v1/mall/recommend/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//商城模块---轮播图修改--王健
export const mallActivityEditApi = (_this, data) => {
    return _this.$post('/v1/mall/recommend/edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//商城模块---轮播图删除--王健
export const mallActivityDeleteApi = (_this, data) => {
    return _this.$fetch('/v1/mall/recommend/deleted?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//商城模块---商品分类左侧菜单获取--王健
export const mallAllGoodsCategoryApi = (_this, data) => {
    return _this.$post('/v1/mall/cate-menu/menu-obtain?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


//商城模块---商品分类列表--王健
export const mallAllGoodsCategoryListApi = (_this, data) => {
    return _this.$post('/v1/mall/cate-menu/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//商城模块---商品分类添加--王健
export const mallAllGoodsCategoryAddApi = (_this, data) => {
    return _this.$post('/v1/mall/cate-menu/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//商城模块---商品分类批量编辑--王健
export const mallAllGoodsCategoryEditApi = (_this, data) => {
    return _this.$post('/v1/mall/cate-menu/edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//商城模块---商品分类删除--王健
export const mallAllGoodsCategoryDeleteApi = (_this, data) => {
    return _this.$fetch('/v1/mall/cate-menu/deleted?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


//商城模块---楼层管理列表--王健
export const mallAllFloorsListApi = (_this, data) => {
    return _this.$post('/v1/mall/floors/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//商城模块---楼层管理新增--王健
export const mallAllFloorsAddApi = (_this, data) => {
    return _this.$post('/v1/mall/floors/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//商城模块---楼层管理修改--王健
export const mallAllFloorsEditApi = (_this, data) => {
    return _this.$post('/v1/mall/floors/edit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//商城模块---楼层管理删除--王健
export const mallAllFloorsDeleteApi = (_this, data) => {
    return _this.$fetch('/v1/mall/floors/deleted?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//商城模块---楼层管理详情--王健
export const mallAllFloorsDetailApi = (_this, data) => {
    return _this.$fetch('/v1/mall/floors/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//商城模块---楼层管理详情--王健
export const mallAllFloorsDetailEditApi = (_this, data) => {
    return _this.$post('/v1/mall/floors/detail-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

//获取供应商商品库存---朱辉
export const getSupplierStock = (_this, data) => {
    return _this.$post('/v1/supply/supplier/stock?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 修改销售合同单备注---朱辉
export const sellOrderEditNote = (_this, data) => {
    return _this.$post('/v1/order/order/edit-note?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 获取销售合同单明细一个商品的锁库信息---朱辉
export const getSellGoodsLockRecords = (_this, data) => {
    return _this.$post('/v1/order/order/goods-stock-records?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 释放销售合同单明细一个商品的锁库记录---朱辉
export const setSellGoodsFreeLock = (_this, data) => {
    return _this.$post('/v1/order/order/free-lock?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 销售合同单明细一个商品的锁库---朱辉
export const setSellLockGoods = (_this, data) => {
    return _this.$post('/v1/order/order/lock-goods?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


// 销售出库单毛利列表 --- 程成
export const getOutProfitListApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/out-profit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 销售出库单毛利导出 --- 程成
export const getOutProfitLisExporttApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/export-out-profit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            browserDwon(res);
        }
    });
};


// 销售出库单毛利明细列表 --- 程成
export const getOutProfitDetailApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/out-detail-profit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 销售出库单毛利明细导出 --- 程成
export const getOutProfitDetailExporttApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/export-out-detail-profit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            browserDwon(res);
        }
    });
};


// 商品毛利分析列表 --- 程成
export const getOutProfitGoodsApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/goods-profit-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//  商品毛利分析导出 --- 程成
export const getOutProfitGoodsExporttApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/goods-profit-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            browserDwon(res);
        }
    });
};


//  品牌毛利分析列表 --- 程成
export const getOutProfitBrandApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/brand-profit-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//  品牌毛利分析列表导出 --- 程成
export const getOutProfitBrandExporttApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/brand-profit-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            browserDwon(res);
        }
    });
};

//  客户毛利分析列表 --- 程成
export const getOutProfitCustomerApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/customer-profit-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//  客户毛利分析列表导出 --- 程成
export const getOutProfitCustomerExporttApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/customer-profit-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            browserDwon(res);
        }
    });
};


//  产品毛利分析列表 --- 程成
export const getOutProfitProductApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/product-profit-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
//  产品毛利分析列表导出 --- 程成
export const getOutProfitProductExporttApi = (_this, data) => {
    return _this.$post('/v1/risk/statistics/product-profit-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            browserDwon(res);
        }
    });
};

// 定向价格列表--xym
export const orienteeringPriceListApi = (_this, data) => {
    return _this.$post('/v1/order/direct/direct/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 定向价格列表导出--xym
export const orienteeringPriceListExportApi = (_this, data) => {
    return _this.$post('/v1/order/direct/direct/export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            browserDwon(res);
        }
    });
};

export const apiOrienteeringPriceListModalName = (_this, data) => {
    return _this.$fetch('/v1/order/direct/direct/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 定向价格明细列表--xym
export const orienteeringPriceListDetailApi = (_this, data) => {
    return _this.$post('/v1/order/direct/direct/detail-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 定向价格明细列表导出--xym
export const orienteeringPriceListDetailExportApi = (_this, data) => {
    return _this.$post('/v1/order/direct/direct/detail-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            browserDwon(res);
        }
    });
};

// 定向价格查询--xym
export const orienteeringPriceQueryApi = (_this, data) => {
    return _this.$post('/v1/order/direct/direct/search-product?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 定向价格新增--xym
export const orienteeringPriceAddApi = (_this, data) => {
    return _this.$post('/v1/order/direct/direct/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 定向价格详情查询--xym
export const orienteeringPriceDetailApi = (_this, data) => {
    return _this.$fetch('/v1/order/direct/direct/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 定向价格基础信息修改--xym
export const orienteeringPriceEditBasicApi = (_this, data) => {
    return _this.$post('/v1/order/direct/direct/update-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 定向价格明细修改--xym
export const orienteeringPriceEditDetailApi = (_this, data) => {
    return _this.$post('/v1/order/direct/direct/update-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 定向价格明细状态更新--xym
export const orienteeringPriceUpdateStatusApi = (_this, data) => {
    return _this.$post('/v1/order/direct/direct/update-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 定向价格明细删除--xym
export const orienteeringPriceDeleteApi = (_this, data) => {
    return _this.$fetch('/v1/order/direct/direct/del?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


// 采购备货修改单列表 --- 史江明
export const purchangeBackEditListApi = (_this, data) => {
    return _this.$post('/v1/order/buy/backchange/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 采购备货修改单新增 --- 史江明
export const purchangeBackEditAddApi = (_this, data) => {
    return _this.$post('/v1/order/buy/backchange/add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 采购备货单详情获取 --- 史江明
export const purchangeBackEditDetailApi = (_this, data) => {
    return _this.$fetch('/v1/order/buy/backchange/detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 采购备货修改单模型名称获取 --- 史江明
export const purchangeBackEditModalNameApi = (_this, data) => {
    return _this.$fetch('/v1/order/buy/backchange/model-name?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 采购备货修改单修改基础信息 --- 史江明
export const purchangeBackEditBasciEditApi = (_this, data) => {
    return _this.$post('/v1/order/buy/backchange/edit-info?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 采购备货修改单明细修改 --- 史江明
export const purchangeBackEditDetailEditApi = (_this, data) => {
    return _this.$post('/v1/order/buy/backchange/edit-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 采购备货修改单删除 --- 史江明
export const purchangeBackEditDeleteApi = (_this, data) => {
    return _this.$post('/v1/order/buy/backchange/remove?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 采购备货修改单状态更新 --- 史江明
export const purchangeBackEditUpdateApi = (_this, data) => {
    return _this.$post('/v1/order/buy/backchange/status-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 根据订货号或型号查询产品--xym
export const orienteeringPriceFuzzySearchApi = (_this, data) => {
    return _this.$post('/v1/order/direct/direct/search-by-product?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 批量添加采购付款单搜索 --- 史江明
export const purchaseFKAddGetHTApi = (_this, data) => {
    return _this.$post('/v1/order/buy/pay/search-buy-order?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 批量添加采购付款单新增 --- 史江明
export const purchaseFKAddApi = (_this, data) => {
    return _this.$post('/v1/order/buy/pay/batch-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 批量提交采购付款单 --- 史江明
export const purchaseFKBatchCommitApi = (_this, data) => {
    return _this.$post('/v1/order/buy/pay/batch-submit?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 批量审批采购付款单新增 --- 史江明
export const purchaseFKApproveCommitApi = (_this, data) => {
    return _this.$post('/v1/order/buy/pay/batch-verify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 通用系列下拉框数据列表 -- xym
export const getAllGeneralSeriesListAPi = (_this, data) => {
    return _this.$fetch('/common/general-series-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 销售请购单批量审批 --- 史江明
export const serviceXsckdBatchApproveApi = (_this, data) => {
    return _this.$post('/v1/order/sell/requisition/batch-verify?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


// 文章管理-栏目管理列表
export const apiGetColumnList = (_this, data) => {
    return _this.$post('/v1/mall/art/column-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 文章管理-栏目新建
export const apiAddColumn = (_this, data) => {
    return _this.$post('/v1/mall/art/column-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 文章管理-栏目新建
export const apiColumnEditSave = (_this, data) => {
    return _this.$post('/v1/mall/art/column-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 文章管理-栏目删除
export const apiColumnDel = (_this, data) => {
    return _this.$post('/v1/mall/art/column-del?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 文章管理-文章列表
export const apiGetArtList = (_this, data) => {
    return _this.$post('/v1/mall/art/art-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


// 文章管理-新增文章
export const apiArtSave = (_this, data) => {
    return _this.$post('/v1/mall/art/art-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


// 文章管理-文章明细
export const apiArtDetail = (_this, data) => {
    return _this.$fetch('/v1/mall/art/art-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


// 文章管理-文章发布/取消发布
export const apiArtRelease = (_this, data) => {
    return _this.$post('/v1/mall/art/update-release?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


// 文章管理-文章明细修改
export const apiArtEditSave = (_this, data) => {
    return _this.$post('/v1/mall/art/art-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


// 文章管理-文章列表修改
export const apiArtListEditSave = (_this, data) => {
    return _this.$post('/v1/mall/art/art-list-update?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


// 文章管理-文章列表删除
export const apiArtDel = (_this, data) => {
    return _this.$post('/v1/mall/art/art-del?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 折扣列表（三种折扣通用） --- 程成
export const operateDiscountListApi = (_this, data) => {
    return _this.$post('/v1/mall/market/discount-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 折扣新增（三种折扣通用） --- 程成
export const operateDiscountAddApi = (_this, data) => {
    return _this.$post('/v1/mall/market/discount-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 折扣详情（三种折扣通用） --- 程成
export const operateDiscountDetailApi = (_this, data) => {
    return _this.$post('/v1/mall/market/discount-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 折扣启停（三种折扣通用） --- 程成
export const operateDiscountUpdateApi = (_this, data) => {
    return _this.$post('/v1/mall/market/discount-use?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 折扣删除（三种折扣通用） --- 程成
export const operateDiscountDeleteApi = (_this, data) => {
    return _this.$post('/v1/mall/market/discount-delete?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 获取所有系列 --- 程成
export const operateDiscountAllSeriesApi = (_this, data) => {
    return _this.$post('/v1/mall/market/series-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};


// 批量审批采购收票单
export const purchaseSPApproveCommitApi = (_this, data) => {
    return _this.$post('/v1/order/buy/invoice/batch-approve?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 库存明细账列表
export const finaceOutBoundBillListApi = (_this, data) => {
    return _this.$post('/v1/store/stock-bills/bills-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 库存明细账列表导出
export const finaceOutBoundBillListExportApi = (_this, data) => {
    return _this.$post('/v1/store/stock-bills/bills-list-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            browserDwon(res);;
        }
    });
};
// 出入库列表
export const finaceOutBoundDetailListApi = (_this, data) => {
    return _this.$post('/v1/store/stock-bills/bills-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 出入库列表导出
export const finaceOutBoundDetailListExportApi = (_this, data) => {
    return _this.$post('/v1/store/stock-bills/bills-detail-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            browserDwon(res);;
        }
    });
};

// 员工内部通知列表 --- 程成
export const userSystemMessageListApi = (_this, data) => {
    return _this.$post('/v1/user/sys-msg/list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 系统通知标记已读 --- 程成
export const userSystemMessageReadApi = (_this, data) => {
    return _this.$post('/v1/user/sys-msg/read?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};

// 积分商品列表--xym
export const operatePointsGoodsListApi = (_this, data) => {
    return _this.$post('/v1/mall/integral/product-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分商品新增--xym
export const operatePointsGoodsAddApi = (_this, data) => {
    return _this.$post('/v1/mall/integral/integral-product-add?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分商品详情--xym
export const operatePointsGoodsDetailApi = (_this, data) => {
    return _this.$post('/v1/mall/integral/product-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分商品明细更新(基础信息和详情描述通用)--xym
export const operatePointsGoodsEditDetailBasicApi = (_this, data) => {
    return _this.$post('/v1/mall/integral/update-product-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分商品图片更新(基础信息和详情描述通用)--xym
export const operatePointsGoodsEditDetailPicsApi = (_this, data) => {
    return _this.$post('/v1/mall/integral/update-product-pic?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分商品上下架--xym
export const operatePointsGoodsUpdateApi = (_this, data) => {
    return _this.$post('/v1/mall/integral/update-product-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分商品上下架批量--xym
export const operatePointsGoodsPatchUpdateApi = (_this, data) => {
    return _this.$post('/v1/mall/integral/patch-update-product-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分商品删除批量--xym
export const operatePointsGoodsPatchDeleteApi = (_this, data) => {
    return _this.$post('/v1/mall/integral/patch-product-del?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分商品删除--xym
export const operatePointsGoodsDeleteApi = (_this, data) => {
    return _this.$fetch('/v1/mall/integral/product-del?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分兑换单列表--xym
export const exchangeListApi = (_this, data) => {
    return _this.$post('/v1/mall/integral/redeem-order-list?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分兑换单详情--xym
export const exchangeDetailApi = (_this, data) => {
    return _this.$fetch('/v1/mall/integral/redeem-order-detail?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分兑换单详情--xym
export const exchangeDetailUpdateApi = (_this, data) => {
    return _this.$post('/v1/mall/integral/update-redeem-order-status?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return res;
        }
    });
};
// 积分兑换单详情--xym
export const exchangeListExportApi = (_this, data) => {
    return _this.$post('/v1/mall/integral/redeem-order-export?token=' + setToken(), data).then(res => {
        if (res.status === -1) {
            apiLoginOut(_this, {
                token: setToken()
            });
        } else {
            return browserDwon(res);
        }
    });
};