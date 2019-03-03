<template>
	<section>
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="子网名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getUser">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新建子网</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="user" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" label="序号" width="120">
			</el-table-column>
			<el-table-column prop="name" label="主机名" width="180" sortable>
			</el-table-column>
			<el-table-column prop="ipAddress" label="主机IP" width="150"  sortable>
			</el-table-column>
			<el-table-column prop="state" label="状态" width="150" sortable>
			</el-table-column>
			<el-table-column prop="imageName" label="镜像名称"  width="150" sortable>
			</el-table-column>
			<el-table-column prop="powerState" label="电源状态" width="150" sortable>
			</el-table-column>
			<el-table-column prop="createTime" label="创建时间" width="150" sortable>
			</el-table-column>
			<el-table-column label="操作" width="250">
				<template scope="scope">
					
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="20" :total="total" style="float:right;">
			</el-pagination>
		</el-col>

		<!--编辑界面-->
		<el-dialog title="编辑" v-model="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="子网名称" prop="name">
					<el-input v-model="editForm.name" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="性别">
					<el-radio-group v-model="editForm.sex">
						<el-radio class="radio" :label="1">男</el-radio>
						<el-radio class="radio" :label="0">女</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="年龄">
					<el-input-number v-model="editForm.age" :min="0" :max="200"></el-input-number>
				</el-form-item>
				<el-form-item label="生日">
					<el-date-picker type="date" placeholder="选择日期" v-model="editForm.birth"></el-date-picker>
				</el-form-item>
				<el-form-item label="地址">
					<el-input type="textarea" v-model="editForm.addr"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增子网" v-model="addFormVisible" :close-on-click-modal="false" width="30%">
			<el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm"  style        ="width:500px;">
				<el-form-item label="名称" prop="name">
					<el-input v-model="addForm.name" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="网络地址" prop="cidr">
					<el-input v-model="addForm.cidr" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="IP版本" prop="ipVersion" >
					<el-input v-model="addForm.ipVersion" placeholder="IPV4" :disabled="true"></el-input>
				</el-form-item>
				<el-form-item label="网关IP" prop="gateway">
					<el-input v-model="addForm.gateway" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="IP地址值起始" prop="addressPoolStart">
					<el-input v-model="addForm.addressPoolStart" auto-complete="off" ></el-input>
				</el-form-item>
				<el-form-item label="IP地址值结尾" prop="addressPoolEnd">
					<el-input v-model="addForm.addressPoolEnd" auto-complete="off" ></el-input>
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
	import { getUserList, deleteUser, addUser, editUser } from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				user: [],
				networkId: '47c2bf3f-4075-4238-8a90-05ea73c9056c',
				networkType: '',
				total: 0,
				page: 1,
				consoleUrl:'',
				listLoading: false,

				editFormVisible: false,//编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [
						{ required: true, message: '请输入名称', trigger: 'blur' }
					]
				},
				//编辑界面数据
				editForm: {
					id: 0,
					name: '',
					image: '',
					ipAddress: '',
					imageName: '',
					networkId: '',
					state:'',
					powerState:'',
					createTime:''
				},

				addFormVisible: false,//新增界面是否显示
				addLoading: false,
				addFormRules: {
					name: [
						{ required: true, message: '请输入子网名称', trigger: 'blur' }
					]
				},
				//新增界面数据
				addForm: {
					name: '',
					image: '',
					ipAddress: '',
					imageName: '',
					networkId: '',
					state:'',
					powerState:'',
					createTime:''
				}
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getUser();
			},
			//获取用户列表
			getUser() {
				let para = {
					page: this.page,
					networkId: this.networkId
				};
				this.listLoading = true;
				//NProgress.start();
				getUserList(para).then((res) => {
					this.total = res.data.total;
					this.user = res.data;
					this.listLoading = false;
					//NProgress.done();
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
					deleteUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						console.log(res);
						console.log(row.id);
						this.getUser();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function () {
				this.addFormVisible = true;
				this.addForm = {
					id: 0,
					name: '',
					image: '',
					ipAddress: '',
					flavor: '',
					networkId: ''
				};
			},
			
			//编辑
			editSubmit: function () {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.editForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth), 'yyyy-MM-dd');
							editSubnet(para).then((res) => {
								this.editLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getUser();
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
							console.log(this.addForm);
							//let para =this.addForm;
							console.log(para);
							addUser(para).then((res) => {

								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								console.log(res);
								this.getUser();
							});
							
						});
					}
				});
			},
			selsChange: function (sels) {
				this.sels = sels;
			},
		},
		mounted() {
			this.getUser();
		}
	}

</script>

<style scoped>

</style>