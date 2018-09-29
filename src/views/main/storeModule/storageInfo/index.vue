<style>
	.outer-div {
		width: 98%;
		margin: 0 auto;
		border-radius: 4px;
		border: 1px rgba(217, 217, 217, 1) solid;
		box-shadow: 0px 0px 4px rgba(217, 217, 217, 0.988235294117647);
		padding-bottom: 10px;
	}
	.outer-div > div {
		padding: 0 15px;
		width: 100%;
		height: 50px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 1px rgba(217, 217, 217, 1) solid;
	}
    .outer-div .font-bolder {
        font-weight: 700
    }
    .outer-div .flex-center {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: nowrap;
    }
    .outer-div .strorage-list > div{
        text-align: center;
		overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .outer-div .strorage-list:hover {
        background-color: rgba(78,179,108,0.2);
        cursor: pointer;
    }
    .outer-div .strorage-list.active {
        background-color: rgba(78,179,108,0.2);
    }
</style>
<template>
	<div>
	    <Row>
	        <Col span="24">
		        <Card>
		            <Row>
				        <Col span="8">
				        	<div class="outer-div">
				        		<div class="header-operate">
				        			<div>
				        				<span style="font-size: 16px; font-weight: 700">仓库</span>
				        			</div>
				        			<div>
				        				<Button v-auth="showAddNewStorage" type="primary" @click="addNewStorage">新增仓库</Button>
				        			</div>
				        		</div>
				        		<div v-for="item in allStorageArr" class="strorage-list" :class="{active: item.store_no == regionDetail.store_no}" @click="toGetAreaListAndResetSeat(item.store_no, item.store_name)" v-if="allStorageArr.length > 0">
				        			<div class="font-bolder" style="width:10%">
				        				<span>{{item.store_no}}</span>
				        			</div>
				        			<div class="font-bolder" style="width:35%">
				        				<span :title="item.store_name">{{item.store_name}}</span>
				        			</div>
				        			<div style="width:20%">
				        				<span>{{item.store_user_name}}</span>
				        			</div>
				        			<div class="flex-center" style="width:20%;min-width:100px;" v-auth="allAuthButton">
				        				<div>
				        					<span style="color: rgb(45, 140, 240);cursor: pointer;" @click.stop="editStorage(item)">编辑</span>
				        				</div>
				        				<div style="padding:0 10px;">
				        					<span style="color: rgb(45, 140, 240);cursor: pointer;" @click.stop="deleteStorage(item.store_no)">删除</span>
				        				</div>
				        				<div style="line-height: 0px;">
				        					<Icon type="ios-arrow-forward" size="21" color="#d4d4d4"></Icon>
				        				</div>
				        			</div>
				        		</div>
                                <div  v-if="allStorageArr.length <= 0" class="strorage-list">
                                    <div style="width:100%">
                                        <span>暂无数据</span>
                                    </div>
                                </div>
				        	</div>
				        </Col>
				        <Col span="8">
				        	<div class="outer-div">
				        		<div class="header-operate">
				        			<div>
				        				<span style="font-size: 16px; font-weight: 700">库区</span>
				        			</div>
				        			<div v-auth="allAuthButton">
				        				<Button type="primary" @click="addNewRegion" v-show="regionDetail.store_no">新增库区</Button>
				        			</div>
				        		</div>
				        		<div v-for="item in allRegionArr" class="strorage-list" :class="{active: item.area_no == locationDetail.area_no}" v-if="allRegionArr.length > 0" @click="toGetSeatList(item.area_no, item.area_name)">
				        			<div class="font-bolder" style="width:35%;text-align:left">
				        				<span :title="item.area_name">{{item.area_name}}</span>
				        			</div>
				        			<div class="flex-center" style="width:25%;min-width:150px;" v-auth="allAuthButton">
				        				<div>
				        					<span style="color: rgb(45, 140, 240);cursor: pointer;" @click.stop="editRegion(item)">编辑</span>
				        				</div>
				        				<div style="padding-left:10px;" v-show="item.is_disable == '1'">
				        					<span style="color: rgb(45, 140, 240);cursor: pointer;" @click.stop="stopArea(item.area_no)">停用</span>
				        				</div>
                                        <div style="padding-left:10px;" v-show="item.is_disable == '0'">
                                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click.stop="startArea(item.area_no)">启用</span>
                                        </div>
				        				<div style="padding:0 10px;">
				        					<span style="color: rgb(45, 140, 240);cursor: pointer;" @click.stop="deleteRegion(item.area_no)">删除</span>
				        				</div>
				        				<div style="line-height: 0px;">
				        					<Icon type="ios-arrow-forward" size="21" color="#d4d4d4"></Icon>
				        				</div>
				        			</div>
				        		</div>
                                <div  v-if="allRegionArr.length <= 0" class="strorage-list">
                                    <div style="width:100%">
                                        <span>暂无数据</span>
                                    </div>
                                </div>
				        	</div>
				        </Col>
				        <Col span="8">
				        	<div class="outer-div">
				        		<div class="header-operate">
				        			<div>
				        				<span style="font-size: 16px; font-weight: 700">库位</span>
				        			</div>
				        			<div v-auth="allAuthButton">
				        				<Button type="primary" @click="addNewLocation"  v-show="locationDetail.area_no">新增库位</Button>
				        			</div>
				        		</div>
				        		<div v-for="item in allLocationArr" class="strorage-list" v-if="allLocationArr.length > 0">
				        			<div class="font-bolder" style="width:35%;text-align:left">
				        				<span :title="item.seat_name">{{item.seat_name}}</span>
				        			</div>
				        			<div class="flex-center" style="width:25%;min-width:150px;" v-auth="allAuthButton">
				        				<div>
				        					<span style="color: rgb(45, 140, 240);cursor: pointer;" @click.stop="editLocation(item)">编辑</span>
				        				</div>
				        				<div style="padding-left:10px;" v-show="item.is_disable == '1'">
                                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click.stop="stopSeat(item.seat_no)">停用</span>
                                        </div>
                                        <div style="padding-left:10px;" v-show="item.is_disable == '0'">
                                            <span style="color: rgb(45, 140, 240);cursor: pointer;" @click.stop="startSeat(item.seat_no)">启用</span>
                                        </div>
				        				<div style="padding:0 10px;">
				        					<span style="color: rgb(45, 140, 240);cursor: pointer;" @click.stop="deleteLocation(item.seat_no)">删除</span>
				        				</div>
				        				<div style="line-height: 0px;">
				        					<Icon type="ios-arrow-forward" size="21" color="#d4d4d4"></Icon>
				        				</div>
				        			</div>
				        		</div>
                                <div  v-if="allLocationArr.length <= 0" class="strorage-list">
                                    <div style="width:100%">
                                        <span>暂无数据</span>
                                    </div>
                                </div>
				        	</div>
				        </Col>
				    </Row>
		        </Card>
	        </Col>
	    </Row>
		<Modal v-model="showDelete" title="确认删除">
            <p>确认删除该{{currentDeleteName}}?</p>
            <div slot="footer">
                <Button type="text" @click="cancelDelete">取消</Button>
                <Button type="primary" @click="confirmDelete">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showStartArea" title="确认启用">
            <p>启用后该库区下的所有库位将启用，确认启用？</p>
            <div slot="footer">
                <Button type="text" @click="cancelStartArea">取消</Button>
                <Button type="primary" @click="confirmStartArea">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showStopArea" title="确认停用">
            <p>停用后该库区下的所有库位将停用，确认停用？</p>
            <div slot="footer">
                <Button type="text" @click="cancelStopArea">取消</Button>
                <Button type="primary" @click="confirmStopArea">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showStartSeat" title="确认启用">
            <p>确认启用该库位？</p>
            <div slot="footer">
                <Button type="text" @click="cancelStartSeat">取消</Button>
                <Button type="primary" @click="confirmStartSeat">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showStopSeat" title="确认停用">
            <p>确认停用该库位？</p>
            <div slot="footer">
                <Button type="text" @click="cancelStopSeat">取消</Button>
                <Button type="primary" @click="confirmStopSeat">确定</Button>
            </div>
        </Modal>
        <Modal v-model="showStorage" :title="addOrEdit + '仓库'" width="1000">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="120" ref="storageDetail" :model="storageDetail" :rules="ruleValidateStorage">
                            <Row>
                                <Col span="24">
                                    <FormItem label="仓库名称：" prop="store_name">
                                        <Input v-model="storageDetail.store_name" placeholder="请输入仓库名称"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="仓库负责人：" prop="store_user_name">
                                        <Input v-model="storageDetail.store_user_name" placeholder="请输入仓库负责人"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="负责人手机号码：" prop="phone">
                                        <Input v-model="storageDetail.phone" placeholder="请输入负责人手机号码"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="电话号码：" prop="telephone">
                                        <Input v-model="storageDetail.telephone" placeholder="请输入电话号码"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="仓库地址：" prop="selectdCities">
                                        <Cascader :data="allAddressArr" v-model="storageDetail.selectdCities" filterable @on-change="getCurrentAddress"></Cascader>
                                    </FormItem>
                                </Col>
                                <Col span="12">
                                    <FormItem label="" prop="address">
                                        <Input v-model="storageDetail.address" placeholder="请输入详细地址"></Input>
                                    </FormItem>
                                </Col>
                            	<Col span="24">
                                    <FormItem label="备注：">
                                        <Input v-model="storageDetail.note" type="textarea" :rows="3" placeholder="请输入备注"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="是否自提点：">
                                        <RadioGroup v-model="storageDetail.isLifting">
                                            <Radio label="是"></Radio>
                                            <Radio label="否"></Radio>
                                        </RadioGroup>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancelOperateStorage">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmOperateStorage">保存</Button>
            </div>
        </Modal> 
        <Modal v-model="showRegion" :title="addOrEdit + '库位'" @on-ok="confirmOperateRegion" width="750">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="100" ref="regionDetail" :model="regionDetail" :rules="ruleValidateRegion">
                            <Row>
                                <Col span="24">
                                    <FormItem label="所属仓库：">
                                        <span>{{regionDetail.store_name}}</span>
                                    </FormItem>
                                </Col>
                                <Col span="24" v-show="addOrEdit == '编辑'">
                                    <FormItem label="库区编号：">
                                        <span>{{regionDetail.area_no}}</span>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="库区名称：" prop="area_name">
                                        <Input v-model="regionDetail.area_name" placeholder="请输入库区名称"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancelOperateRegion">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmOperateRegion">保存</Button>
            </div>
        </Modal> 
        <Modal v-model="showLocation" :title="addOrEdit + '库位'" @on-ok="confirmOperateLocation" width="750">
            <Row>
                <col span="24">
                    <Card>
                        <Form :label-width="100" ref="locationDetail" :model="locationDetail" :rules="ruleValidateLocation">
                            <Row>
                                <Col span="24">
                                    <FormItem label="所属仓库：">
                                        <span>{{locationDetail.store_name}}</span>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="所属库区：">
                                        <span>{{locationDetail.area_name}}</span>
                                    </FormItem>
                                </Col>
                                <Col span="24" v-show="addOrEdit == '编辑'">
                                    <FormItem label="库位编号：">
                                        <span>{{locationDetail.seat_no}}</span>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="库位名称：" prop="seat_name">
                                        <Input v-model="locationDetail.seat_name" placeholder="请输入库位名称"></Input>
                                    </FormItem>
                                </Col>
                                <Col span="24">
                                    <FormItem label="备注：">
                                        <Input v-model="locationDetail.note" type="textarea" :rows="3" placeholder="请输入备注"></Input>
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </Card>
                </col>
            </Row>
            <div slot="footer">
                <Button type="text" @click="cancelOperateLocation">取消</Button>
                <Button type="primary" :loading="loading" @click="confirmOperateLocation">保存</Button>
            </div>
        </Modal>         
	</div>
</template>
<script type="text/ecmascript-6">
    import { apiGetAllStorageList, apiAddNewStorage, apiEditStorage, apiDeleteStorage, apiGetAllAreaList, apiAddNewArea, apiEditArea,
             apiDeleteArea, apiGetAllSeatList, apiAddNewSeat, apiEditSeat, apiDeleteSeat, apiActiveAreaSeat, apiMapDetail } from '@/config/getData';
    import { notempty, sortBy} from '@/config/mUtils';
    import util from '@/libs/util';
    import Cookies from 'js-cookie';
    export default {
    	name: 'storage_info',
        data () {
            return {
            	currentDeleteName: '仓库',
                loading: false,
            	addOrEdit: '新增',
                orderToDelete: '',
            	showDelete: false,
                showStartArea: false,
                showStopArea: false,
                showStartSeat: false,
                showStopSeat: false,
            	//仓库所用参数
            	showAddNewStorage: 'store_add_button',
                allAuthButton: 'store_all_edit_button',
            	showStorage: false,
            	storageDetail: {
            		store_name: '',
            		store_user_name: '',
            		phone: '',
            		telephone: '',
            		province_no: '',
            		city_no: '',
            		county_no: '',
            		selectdCities: [],
            		address: '',
            		note: '',
            		isLifting: '否',
            	},
            	ruleValidateStorage: {
            		store_name: [
                        { required: true, message: '仓库不能为空', trigger: 'blur' }
                    ],
                    store_user_name: [
                        { required: true, message: '仓库负责人不能为空', trigger: 'blur' }
                    ],
                    phone: [
                        { required: true, message: '手机号码格式有误', pattern: /^1\d{10}$/, trigger: 'blur'}
                    ],
                    telephone: [
                        { required: true, message: '电话号码不能为空', trigger: 'blur'}
                    ],
                    address: [
                        { required: true, message: '详细地址不能为空', trigger: 'blur'}
                    ],
                    selectdCities: [
                        { required: true, message: '退货地址区域不能为空', trigger: 'blur', type: 'array' }
                    ]
            	},
            	//库区所用参数
            	showRegion: false,
            	regionDetail: {
                    store_no: '',
                    store_name: '',
            		area_name: '',
                    area_no: ''
                },
                ruleValidateRegion: {
                    area_name: [
                        { required: true, message: '库区名称为空', trigger: 'blur' }
                    ]
                },
                //库位所用参数
                showLocation: false,
                locationDetail: {
                    store_no: '',
                    store_name: '',
                    area_no: '',
                    area_name: '',
            		seat_name: '',
            	},
            	ruleValidateLocation: {
            		seat_name: [
                        { required: true, message: '库区名称为空', trigger: 'blur' }
                    ],
                    note: [
                        { required: true, message: '备注', trigger: 'blur' }
                    ]
            	},

               	allStorageArr: [],
               	allRegionArr: [],
               	allLocationArr: [],
               	allAddressArr: []
            };
        },
        methods: {
           	getAllStorageList () {
           		apiGetAllStorageList(this, {}).then(res => {
           			if (res && res.status == 1) {
           				this.allStorageArr = res.data.list;
           			}
           		})
           	},
           	addNewStorage() {
           		this.addOrEdit = '新增';
                this.$refs['storageDetail'].resetFields();
           		this.showStorage = true;
           	},
           	editStorage(item) {
                item.isLifting = item.is_lifting == '0' ? '否' : '是';
           		this.storageDetail = JSON.parse(JSON.stringify(item));
           		this.storageDetail.selectdCities = [item.province_no, item.city_no, item.county_no];
           		this.addOrEdit = '编辑';
           		this.showStorage = true;
           	},
           	deleteStorage(number) {
           		this.currentDeleteName = '仓库';
           		this.showDelete = true;
                this.orderToDelete = number;
      	    },
      	    confirmOperateStorage() {
           		this.$refs['storageDetail'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        this.storageDetail.is_lifting = this.storageDetail.isLifting == '否' ? '0' : '1';
                        if (this.addOrEdit == '新增') {
                            apiAddNewStorage(this, {
                                params: JSON.stringify(this.storageDetail)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('新增成功!');
                                    this.getAllStorageList();
                                    this.showStorage = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                                this.loading = false;
                            });
                        } else {
                            apiEditStorage(this, {
                                params: JSON.stringify(this.storageDetail)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('修改成功!');
                                    this.getAllStorageList();
                                    this.showStorage = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                                this.loading = false;
                            });
                        }
                    }

           		});
           	},
           	cancelOperateStorage() {
           		this.$refs['storageDetail'].resetFields();
           		this.showStorage = false;
           	},


            //库区方法
            toGetAreaList(storeId, storeName) {
                apiGetAllAreaList(this, {
                    store_no: storeId
                }).then(res => {
                    if (res && res.status == 1) {
                        this.allRegionArr = res.data;
                        this.regionDetail.store_no = storeId;
                        this.regionDetail.store_name = storeName;
                    }
                });
            },
            toGetAreaListAndResetSeat(storeId, storeName) {
                apiGetAllAreaList(this, {
                    store_no: storeId
                }).then(res => {
                    if (res && res.status == 1) {
                        this.allRegionArr = res.data;
                        this.regionDetail.store_no = storeId;
                        this.regionDetail.store_name = storeName;
                        //重置库位信息
                        this.allLocationArr = [];
                        this.locationDetail.area_no = '';
                    }
                });
            },
      	    addNewRegion() {
           		this.addOrEdit = '新增';
                this.$refs['regionDetail'].resetFields();
           		this.showRegion = true;
           	},
           	editRegion(item) {
           		this.regionDetail = JSON.parse(JSON.stringify(item));
           		this.addOrEdit = '编辑';
           		this.showRegion = true;
           	},
           	stopArea(number) {
                this.showStopArea = number;
            },
            cancelStopArea() {
                this.showStopArea = false;
            },
            confirmStopArea() {
                apiActiveAreaSeat(this, {
                    params: JSON.stringify({
                        area_no: this.showStopArea,
                        is_disable: 0
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('停用成功!');
                        this.toGetAreaList(this.regionDetail.store_no, this.regionDetail.store_name); 
                        apiGetAllSeatList(this, {
                            store_no: this.regionDetail.store_no,
                            area_no: this.showStopArea
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.allLocationArr = res.data;
                            }
                        });
                        this.showStopArea = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            startArea(number) {
                this.showStartArea = number;
            },
            cancelStartArea() {
                this.showStartArea = false;
            },
            confirmStartArea() {
                apiActiveAreaSeat(this, {
                    params: JSON.stringify({
                        area_no: this.showStartArea,
                        is_disable: 1
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('启用成功!');
                        this.toGetAreaList(this.regionDetail.store_no, this.regionDetail.store_name); 
                        apiGetAllSeatList(this, {
                            store_no: this.regionDetail.store_no,
                            area_no: this.showStartArea
                        }).then(res => {
                            if (res && res.status == 1) {
                                this.allLocationArr = res.data;
                            }
                        });
                        this.showStartArea = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
           	deleteRegion(number) {
           		this.currentDeleteName = '库区';
           		this.showDelete = true;
                this.orderToDelete = number;
           	},
           	confirmOperateRegion() {
           		this.$refs['regionDetail'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        if (this.addOrEdit == '新增') {
                            apiAddNewArea(this, {
                                params: JSON.stringify(this.regionDetail)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('新增成功!');
                                    this.toGetAreaList(this.regionDetail.store_no, this.regionDetail.store_name);
                                    this.showRegion = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                                this.loading = false;
                            });
                        } else {
                            apiEditArea(this, {
                                params: JSON.stringify(this.regionDetail)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('修改成功!');
                                    this.toGetAreaList(this.regionDetail.store_no, this.regionDetail.store_name);
                                    this.showRegion = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                                this.loading = false;
                            });
                        }
                    }
           		});
           	},
           	cancelOperateRegion() {
           		this.$refs['regionDetail'].resetFields();
           		this.showRegion = false;
           	},

           	// 库位方法
            toGetSeatList(areaId, areaName) {
                apiGetAllSeatList(this, {
                    store_no: this.regionDetail.store_no,
                    area_no: areaId
                }).then(res => {
                    if (res && res.status == 1) {
                        this.allLocationArr = res.data;
                        this.locationDetail.store_name = this.regionDetail.store_name;
                        this.locationDetail.store_no = this.regionDetail.store_no;
                        this.locationDetail.area_no = areaId;
                        this.locationDetail.area_name = areaName;
                    }
                });
            },
      	    addNewLocation() {
           		this.addOrEdit = '新增';
                this.$refs['locationDetail'].resetFields();
                this.locationDetail.note = '';
           		this.showLocation = true;
           	},
           	editLocation(item) {
           		this.locationDetail = JSON.parse(JSON.stringify(item));
           		this.addOrEdit = '编辑';
           		this.showLocation = true;
           	},
            stopSeat(number) {
                this.showStopSeat = number;
            },
            cancelStopSeat() {
                this.showStopSeat = false;
            },
            confirmStopSeat() {
                apiActiveAreaSeat(this, {
                    params: JSON.stringify({
                        seat_no: this.showStopSeat,
                        is_disable: 0
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('停用成功!');
                        this.toGetSeatList(this.locationDetail.area_no, this.locationDetail.area_name);
                        this.showStopSeat = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
            startSeat(number) {
                this.showStartSeat = number;
            },
            cancelStartSeat() {
                this.showStartSeat = false;
            },
            confirmStartSeat() {
                apiActiveAreaSeat(this, {
                    params: JSON.stringify({
                        seat_no: this.showStartSeat,
                        is_disable: 1
                    })
                }).then(res => {
                    if (res && res.status == 1) {
                        this.$Message.success('启用成功!');
                        this.toGetSeatList(this.locationDetail.area_no, this.locationDetail.area_name);
                        this.showStartSeat = false;
                    } else {
                        this.$Message.error(res.message);
                    }
                });
            },
           	deleteLocation(number) {
           		this.currentDeleteName = '库位';
           		this.showDelete = true;
                this.orderToDelete = number;
           	},
           	confirmOperateLocation() {
           		this.$refs['locationDetail'].validate((valid) => {
                    if (valid) {
                        this.loading = true;
                        if (this.addOrEdit == '新增') {
                            apiAddNewSeat(this, {
                                params: JSON.stringify(this.locationDetail)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('新增成功!');
                                    this.toGetSeatList(this.locationDetail.area_no, this.locationDetail.area_name);
                                    this.showLocation = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                                this.loading = false;
                            });
                        } else {
                            apiEditSeat(this, {
                                params: JSON.stringify(this.locationDetail)
                            }).then(res => {
                                if (res && res.status == 1) {
                                    this.$Message.success('修改成功!');
                                    this.toGetSeatList(this.locationDetail.area_no, this.locationDetail.area_name);
                                    this.showLocation = false;
                                } else {
                                    this.$Message.error(res.message);
                                }
                                this.loading = false;
                            });
                        }
                    }
           		});
           	},
           	cancelOperateLocation() {
           		this.$refs['locationDetail'].resetFields();
           		this.showLocation = false;
           	},
           	getMapDetail () {
                apiMapDetail(this, {}).then(res => {
                    let valueToString = function (mapArr) {
                        mapArr.forEach(item => {
                            item.value = item.value.toString();
                            if (item.children && item.children.length > 0) {
                                valueToString(item.children);
                            }
                        })  
                    };
                    valueToString(res.data);
                    this.allAddressArr = res.data;
                });
            },
            getCurrentAddress(value) {
            	[this.storageDetail.province_no, this.storageDetail.city_no, this.storageDetail.county_no] = value;
            },
            cancelDelete() {
                this.showDelete = false;
            },
            confirmDelete() {
                if (this.currentDeleteName == '仓库') {
                    apiDeleteStorage(this, {
                        store_no: this.orderToDelete
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success('删除成功!');
                            this.getAllStorageList();
                            this.showDelete = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
                if (this.currentDeleteName == '库区') {
                    apiDeleteArea(this, {
                        area_no: this.orderToDelete
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success('删除成功!');
                            this.toGetAreaList(this.regionDetail.store_no, this.regionDetail.store_name);
                            this.showDelete = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
                if (this.currentDeleteName == '库位') {
                    apiDeleteSeat(this, {
                        seat_no: this.orderToDelete
                    }).then(res => {
                        if (res && res.status == 1) {
                            this.$Message.success('删除成功!');
                            this.toGetSeatList(this.locationDetail.area_no, this.locationDetail.area_name);
                            this.showDelete = false;
                        } else {
                            this.$Message.error(res.message);
                        }
                    });
                }
            },
        },
        created () {
            this.getMapDetail();
            this.getAllStorageList();
        }
    };
</script>
