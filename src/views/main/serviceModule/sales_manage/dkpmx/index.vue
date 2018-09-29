<template>
    <div style="position: relative" class="diy-opcity">
        <Row>
            <Col span="24">
            <Card>
                <Form :model="orderInfo" :label-width="120" class="model-style">
                    <Row>
                        <Col span="4">
                        <Input v-model="orderInfo.djbh" placeholder="输入销售合同单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.brand" filterable @on-change="search">
                            <Option v-for="status in brandArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.product_no" placeholder="输入产品名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.product_model" placeholder="输入产品型号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.order_no" placeholder="输入订货号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.pay_status"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in payStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Select v-model="orderInfo.order_status"  placeholder="请选择" @on-change="search">
                            <Option v-for="status in orderStatusArr" :value="status.value" :key="status.value">{{ status.label }}</Option>
                        </Select>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.customer_no" placeholder="输入客户编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.customer_name" placeholder="输入客户名称" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                        <DatePicker type="datetimerange" placeholder="选择创建时间" :value='orderInfo.datetime' @on-change="datetime" style="width: 100%;"></DatePicker>
                        </Col>
                        <Col span="4">
                        <Input v-model="orderInfo.ckd_djbh" placeholder="输入销售出库单编号" @on-enter="search"></Input>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.czyg_ygbh"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in orderInfo.appointKf" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                        <Col span="4">
                            <Select v-model="orderInfo.xsyg_ygbh"  placeholder="请选择" filterable @on-change="search">
                                <Option v-for="item in orderInfo.allSales" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </Col>
                    </Row>
                </Form>
            </Card>
            </Col>
        </Row>
        <Row class="margin-top-10 margin-pag-botm">
            <Col span="24">
            <Card>
            	<Row class="margin-bottom-10" v-auth="serviceButton">
                    <Col span="24">
                    <Button type="primary" @click="toInvoice('normal')">开增值税普票</Button>
                    <Button type="primary" class="margin-left-10" @click="toInvoice('special')">开增值税专票</Button>
                    <Button type="primary" class="margin-left-10" @click="exportData()" v-auth="DKPMXList_export">导出</Button>
                    </Col>
                </Row>
                <el-table :row-class-name="tableRowClassName" :data="orderData.data" border ref="multipleTable" style="text-align: center" @sort-change="manualSort" @select="selectOne"  @select-all="selectAll" max-height="570">
                	 <el-table-column
                            type="selection"
                            width="55" :selectable="canSelect" fixed>
                    </el-table-column>
                    <el-table-column label="销售合同单编号" width="120">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.djbh}, 'service-sales-htd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column label="销售出库单编号" width="140">
                        <template slot-scope="scope">
                            <span  @click="handleClick({param: scope.row.ckd_djbh}, 'service-xsckd-detail')" type="text" size="small"><span style="color: rgb(45, 140, 240);cursor: pointer;">{{scope.row.ckd_djbh}}</span></span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="djrq" label="创建时间" sortable="custom" width="150"></el-table-column>
                    <el-table-column prop="khbh" label="客户编号" width="120"></el-table-column>
                    <el-table-column prop="khmc" label="客户名称" min-width="200" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpppmc" label="品牌" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpmc" label="产品名称" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpxh" label="产品型号" min-width="150" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="cpdhh" label="订货号" min-width="100" sortable="custom" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="jldw" label="计量单位"></el-table-column>
                    <el-table-column prop="cksl" label="出库数量" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column prop="ckdj" label="开票单价" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column prop="to_invoice_num" label="待开票数量" sortable="custom" min-width="120"></el-table-column>
                    <el-table-column prop="arrive_funds_rate" label="到款比例" sortable="custom" min-width="100"></el-table-column>
                    <el-table-column label="支付状态" prop="khzfzt" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ payStatus[scope.row.khzfzt] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="订单状态" prop="xshtdzt" sortable="custom" min-width="100">
                        <template slot-scope="scope">
                            <span> {{ orderStatus[scope.row.xshtdzt] }}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="xsyg" label="销售人员" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                    <el-table-column prop="czyg" label="客服人员" sortable="custom" min-width="120" show-overflow-tooltip></el-table-column>
                </el-table>
                <pagination v-on:getPage="getNowPage" v-on:getLimit="getNowLimit" :totalnum="totalnum" :current="currentPage" class="pagination-style"></pagination>
            </Card>
            </Col>
        </Row>
    </div>
</template>
<script type="text/ecmascript-6">
    import pagination from '../../../../common/pagination.vue';
    import { apiAllStatus, apiGetServiceInvoiceItem, operateAllBrandsList, apiGetServiceInvoiceVerify, apiExportInvoiceToMakeData,apiCustomerAllStaff } from '@/config/getData';
    import { notempty } from '@/config/mUtils';
    import util from '@/libs/util';

    export default {
        name: 'service-dkpmx-index',
        data () {
            return {
                serviceButton: 'service_dkpmx_button',
                DKPMXList_export: 'DKPMXList_export',
                orderInfo: {
                    djbh: '',
                    ckd_djbh: '',
                    brand: 'all',
                    product_no: '',
                    product_model: '',
                    order_no: '',
                    pay_status: 'all',
                    order_status: 'all',
                    customer_no: '',
                    customer_name: '',
                    datetime: '',
                    appointKf:[{
                        value: 'all',
                        label: '选择客服'
                    }],
                    allSales:[{
                        value: 'all',
                        label: '选择销售'
                    }],
                    czyg_ygbh:'all',
                    xsyg_ygbh:'all',
                },
                orderData: {
                    data: []
                },
                orderField: '',
                orderDirection: 'desc',
                limit: 10,
                currentPage: 1,
                totalnum: 0,
                multipleSelection: [],
                payStatus: [],
                payStatusArr: [{ 
                	   label: '选择支付状态',
                	   value: 'all'
				}],
                orderStatus: [],
                orderStatusArr: [{
                	label: '选择订单状态',
                	value: 'all'	
				}],
				brandArr: [{
                	label: '选择品牌',
                	value: 'all'	
				}],
				ids: []
            };
        },
        components: {
            pagination
        },
        methods: {
            exportData () {
                apiExportInvoiceToMakeData(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        djbh: this.orderInfo.djbh,
                        ckd_djbh: this.orderInfo.ckd_djbh,
                        cpppbh: this.orderInfo.brand === 'all' ? '' : this.orderInfo.brand,
                        cpmc: this.orderInfo.product_no ,
                        cpxh: this.orderInfo.product_model,
                        cpdhh: this.orderInfo.order_no,
                        khzfzt: this.orderInfo.pay_status === 'all' ? '' : this.orderInfo.pay_status,
                        xshtdzt: this.orderInfo.order_status === 'all' ? '' : this.orderInfo.order_status,
                        khbh: this.orderInfo.customer_no,
                        khmc: this.orderInfo.customer_name,
                        date_from: this.orderInfo.datetime[0],
                        date_to: this.orderInfo.datetime[1],
                        czyg_ygbh: this.orderInfo.czyg_ygbh === 'all' ? '' : this.orderInfo.czyg_ygbh,
                        xsyg_ygbh: this.orderInfo.xsyg_ygbh === 'all' ? '' : this.orderInfo.xsyg_ygbh
                    }))
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                    }
                });
            },
            handleClick (param, path) {
                util.openNewPage(this, path, param);
                this.$router.push({
                    name: path,
                    query: param
                });
            },
            getStatus () {
                apiAllStatus(this, {
                    type: JSON.stringify(['khzfzt', 'xshtdzt'])
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        let tmpObj = {};
                        this.payStatus = res.data.khzfzt;
                        for (let key in res.data.khzfzt) {
                            if (res.data.khzfzt.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.khzfzt[key]
                                };
                                this.payStatusArr.push(tmpObj);
                            }
                        }
                        this.orderStatus = res.data.xshtdzt;
                        for (let key in res.data.xshtdzt) {
                            if (res.data.xshtdzt.hasOwnProperty(key)) {
                                tmpObj = {
                                    value: key,
                                    label: res.data.xshtdzt[key]
                                };
                                this.orderStatusArr.push(tmpObj);
                            }
                        }
                    }
                });
                operateAllBrandsList(this, {}).then(res => {
                    if (res && res.status == 1) {
                        res.data.list.forEach(item => {
                            item.value = item.cpppbh;
                            item.label = item.cpppmc;
                            this.brandArr.push(item);
                        });
                    }
                });
                 //所有销售
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'all_sale'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        this.all_Sales = res.data.list;
                        res.data.list.forEach(item => {
                            item.value = item.ygbh;
                            item.label = item.ygxm;
                            this.orderInfo.allSales.push(item);
                        });
                    }
                });

                //指定客服
                apiCustomerAllStaff(this, {
                    params: JSON.stringify({
                        type: 'all_customer_service'
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        //成功
                        res.data.list.forEach(item => {
                            item.value = item.czyg_ygbh;
                            item.label = item.czyg;
                            this.orderInfo.appointKf.push(item);
                        });
                    }
                });
            },
            canSelect (row) {
            	if (row.xshtdzt == 6 || row.xshtdzt == 10) {
            	} else {
            		return true;
            	}
            },
            selectOne (selection, row) {
                if (!!selection && typeof selection != 'number') {
                    row.checked = !row.checked;
                } else {
                    row.checked = !!selection;
                }
                if (row.checked && !(this.multipleSelection.includes(row.id))) {
                    this.multipleSelection.push(row.id);
                }
                if (!row.checked && this.multipleSelection.includes(row.id)) {
                    let index = this.multipleSelection.indexOf(row.id);
                    this.multipleSelection.splice(index, 1);
                }
            },
            selectAll (selection) {
                this.orderData.data.forEach(item => {
                    this.selectOne(selection.length, item);
                });
            },
            getData () {
                apiGetServiceInvoiceItem(this, {
                    params: JSON.stringify(this.notempty({
                        numPerPage: this.limit,
                        pageNum: this.currentPage,
                        orderField: this.orderField,
                        orderDirection: this.orderDirection,
                        djbh: this.orderInfo.djbh,
                        ckd_djbh: this.orderInfo.ckd_djbh,
                        cpppbh: this.orderInfo.brand === 'all' ? '' : this.orderInfo.brand,
                        cpmc: this.orderInfo.product_no ,
                        cpxh: this.orderInfo.product_model,
                        cpdhh: this.orderInfo.order_no,
                        khzfzt: this.orderInfo.pay_status === 'all' ? '' : this.orderInfo.pay_status,
                        xshtdzt: this.orderInfo.order_status === 'all' ? '' : this.orderInfo.order_status,
                        khbh: this.orderInfo.customer_no,
                        khmc: this.orderInfo.customer_name,
                        date_from: this.orderInfo.datetime[0],
                        date_to: this.orderInfo.datetime[1],
                        czyg_ygbh: this.orderInfo.czyg_ygbh === 'all' ? '' : this.orderInfo.czyg_ygbh,
                        xsyg_ygbh: this.orderInfo.xsyg_ygbh === 'all' ? '' : this.orderInfo.xsyg_ygbh
                    }))
                }).then(res => {
                    if(res && res.status == 1){
                        this.orderData.data = res.data.list;
                        this.totalnum = res.data.totalCount;
                        this.$nextTick(() => {
                            this.orderData.data.forEach(row => {
                                if (this.multipleSelection.includes(row.id)) {
                                    row.checked = true;
                                    this.$refs.multipleTable.toggleRowSelection(row);
                                }
                            });
                        });
                    }else{
                        this.$Message.error(res.message);
                    }
                });
            },
            toInvoice (name) {
            	if (this.multipleSelection.length != 0 ) {
            		this.ids = JSON.stringify(this.multipleSelection);

            		apiGetServiceInvoiceVerify(this, {
            			ids: this.multipleSelection.join(',')
            		}).then(res => {
	                    if (res && res.status == 1) {
	                        if (name === 'normal') {
		            			this.handleClick({ids: this.ids, type: '2'}, 'purchase_manage_HT_toInvoiceDetail');
		            	    } else if (name === 'special') {
		            	    	this.handleClick({ids: this.ids, type: '1'}, 'purchase_manage_HT_toInvoiceDetail');
		            	    }
	                    } else {
                            let mess = '';
                            if (res.message.constructor === Array) {
                                for (let i in res.message) {
                                	if (mess) {
                                		mess = mess + '</br>' + res.message[i];
                                	} else {
                                		mess = res.message[i];
                                	}                      
                                }
                            } else {
                                mess = res.message;
                            }
                            this.$Message.error({
                                content: mess,
                                duration: 5,
                                closable: true
                            });
	                    }
	                });          		
            	} else {
            		 this.$Message.error('请选择单据');
            	}
            	
            },
            datetime (time) {
             	this.orderInfo.datetime = time;	
                this.search();
            },
            search () {
                this.currentPage = 1;
                this.getData();
            },
            reset () {
                this.orderInfo = {
                    djbh: '',
                    ckd_djbh: '',
                    brand: 'all',
                    product_no: '',
                    product_model: '',
                    order_no: '',
                    pay_status: 'all',
                    order_status: 'all',
                    customer_no: '',
                    customer_name: '',
                    datetime: [],
                    xsyg_ygbh:'all',
                    czyg_ygbh:'all'
                };
                this.search();
            },
            getNowPage (page) {
                this.currentPage = page;
                this.getData();
            },
            getNowLimit (limit) {
                this.limit = limit;
                this.currentPage = 1;
                this.getData();
            },
            manualSort (column) {
                this.orderDirection = column.order == "descending" ? 'desc' : 'asc';
                this.orderField = column.prop;
                this.currentPage = 1;
                this.getData();
            }
        },
        created () {
            this.getStatus();
            this.getData();
        },
        // activated() {
        //     this.getData();
        // }
    };
</script>
