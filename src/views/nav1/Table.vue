<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="网络名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUsers">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新建网络</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="users" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="selection" width="55">
			</el-table-column>
			<el-table-column type="index" label="序号" width="120">
			</el-table-column>
			<el-table-column prop="name" label="网络名称" width="180" sortable>
			</el-table-column>
			<el-table-column prop="type" label="网络类型" width="150"  sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" width="150" sortable>
			</el-table-column>
			<el-table-column prop="isShared" label="共享的" :formatter="formatShared" width="150" sortable>
			</el-table-column>
			<el-table-column prop="tenantName" label="项目" width="150" sortable>
			</el-table-column>
			<el-table-column prop="isAdminStateUp" label="管理员状态" min-width="120" :formatter="formatStateUp"  sortable>
			</el-table-column>
			<el-table-column prop="subnetNumber" label="子网" min-width="120" @cell-click="goToSubnet(scope.row)" sortable>
			<template slot-scope="scope">
         		 <router-link :to="{ name: '子网', params: { networkId: scope.row.id }}">{{scope.row.subnetNumber}}</router-link>
        	</template>
			</el-table-column>
			<el-table-column prop="serverNumber" label="主机" min-width="120" @cell-click="goToServer(scope.row)" sortable>
			<template slot-scope="scope">
         		 <router-link :to="{ name: '实例', params: { networkId: scope.row.id }}">{{scope.row.serverNumber}}</router-link>
        	</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="100px" :rules="editFormRules" ref="editForm">
				<el-form-item label="网络名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="管理员状态">
					<el-radio-group v-model="editForm.stateUp">
						<el-radio class="radio" :label="1">上</el-radio>
						<el-radio class="radio" :label="0">下</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="共享">
					<el-radio-group v-model="editForm.isShared">
						<el-radio clasls="radio" :label="1">是</el-radio>
						<el-radio class="radio" :label="0">否</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--新增界面-->
		<el-dialog title="新增网络" v-model="addFormVisible" :close-on-click-modal="false" width="30%">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm"  style        ="width:500px;">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="项目选择">
					<el-select v-model="addForm.tenantId" clearable  placeholder="请选择">
    					<el-option
      						v-for="item in project"
      						:key="item.id"
      						:label="item.name"
      						:value="item.id">
    					</el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="网络类型">
					<el-select v-model="addForm.type" clearable  placeholder="请选择" @change="chooseNetworkType">
    					<el-option
      						v-for="item in networkType"
      						:key="item"
      						:label="item"
      						:value="item">
    					</el-option>
  					</el-select>
				</el-form-item>
				<el-form-item label="物理网段" v-show="physicalShow">
					<el-select v-model="addForm.physical" clearable  placeholder="请选择" >
    					<el-option
      						v-for="item in physical"
      						:key="item"
      						:label="item"
      						:value="item">
    					</el-option>
  					</el-select>
				</el-form-item>
				
				<el-form-item label="段ID" v-show="segmentIdShow">
					<el-input v-model="addForm.segmentId" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="共享">
					<el-radio-group v-model="addForm.isShared">
						<el-radio class="radio" :label="true">是</el-radio>
						<el-radio class="radio" :label="false">否</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="状态">
					<el-radio-group v-model="addForm.stateUp">
						<el-radio class="radio" :label="true">上</el-radio>
						<el-radio class="radio" :label="false">下</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util'
	//import NProgress from 'nprogress'
	import { getNetworkList, getNetworkTypeList,removeNetwork, editNetwork, addNetwork, getProjectList, getPhysicalList } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				users: [],
				networkType:[],
				project:[],
				physical:[],
				total: 0,
				page: 1,
				physicalShow: false,
				segmentIdShow: false,
				listLoading: false,
				sels: [],//列表选中列

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: '',
					name: '',
					isShared: true,
					stateUp: ''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入姓名', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name:'',
					physical: '',
					tenantId: '',
					segmentId: -1,
					type: 0,
					stateUp: '',
					isShared: ''
				}
			}
		},
		methods: {
			formatShared: function (row, column) {
				return row.isShared ? '是' :  '否' ;
			},
			formatStateUp: function (row, column) {
				return row.isShared ? '上' :  '下' ;
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getUsers();
			},
			chooseNetworkType(val){
				if(val=='FLAT'||val=='VLAN'){
					this.physicalShow=true;
				} else {
					this.physicalShow=false;
				}

				if(val=='VLAN'||val=='VXLAN'||val=='GRE'){
					this.segmentIdShow=true;
				} else {
					this.segmentIdShow=false;
				}
			console.log("choose"+val);

			},
			//获取用户列表
			getUsers() {
				let para = {
					page: this.page,
					name: this.filters.name
				};
				this.listLoading = true;
				//NProgress.start();
				getNetworkList().then((res) => {
					this.total = res.data.total;
					this.users = res.data;
					this.listLoading = false;
					//NProgress.done();
				});
			},
			//获取网络类型列表
			getNetworkType(){
				getNetworkTypeList().then((res) => {
					this.networkType=res.data;
					console.log(this.networkType);
				});
			},
			//获取项目列表
			getProject(){
				getProjectList().then((res) => {
					this.project=res.data;
					console.log(this.project);
				});
			},
			//获取项目列表
			getPhysical(){
				getPhysicalList().then((res) => {
					this.physical=res.data;
					console.log(this.physical);
				});
			},
			//删除
			handleDel: function (index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { id: row.id };
					deleteNetwork(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//跳转到子网页面
			goToSubnet: function (row) {
				console.log("network id",row.id);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					name: '',
					sex: -1,
					age: 0,
					birth: '',
					addr: ''
				};
			},
			//编辑
			editSubmit: function (index,row) {
			console.log("edtit"+this.editForm.stateUp);
			let para = Object.assign({}, this.editForm);
			console.log("para:"+para);
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);

							console.log(this.editForm);
							editNetwork(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function () {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
						
							addNetwork(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getUsers();
							});
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function () {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = { ids: ids };
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getUsers();
			this.getNetworkType();
			this.getProject();
			this.getPhysical();

		}
	}

</script>

<style scoped>

</style>