import { useEffect, useMemo, useState } from "react"
import {
  FaCheckCircle,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaLock,
  FaPlus,
  FaSave,
  FaSearch,
  FaShieldAlt,
  FaSyncAlt,
  FaUndo,
  FaUserCheck,
  FaUserCog,
  FaUserSlash,
  FaUsers,
} from "react-icons/fa"

import { adminApi } from "../../services/api"
import { useAdminAuth } from "../../context/AdminAuthContext"

const fallbackPermissionsByRole = {
  superAdmin: {
    dashboard: { view: true },
    leads: {
      view: true,
      update: true,
      assign: true,
      archive: true,
      export: true,
    },
    followUps: { view: true, update: true },
    contactInquiries: { view: true, update: true, archive: true },
    notifications: { view: true, update: true },
    controlRoom: {
      view: true,
      createMembers: true,
      updateMembers: true,
      deactivateMembers: true,
    },
  },

  admin: {
    dashboard: { view: true },
    leads: {
      view: true,
      update: true,
      assign: true,
      archive: true,
      export: true,
    },
    followUps: { view: true, update: true },
    contactInquiries: { view: true, update: true, archive: true },
    notifications: { view: true, update: true },
    controlRoom: {
      view: true,
      createMembers: true,
      updateMembers: true,
      deactivateMembers: false,
    },
  },

  consultant: {
    dashboard: { view: true },
    leads: {
      view: true,
      update: true,
      assign: false,
      archive: false,
      export: false,
    },
    followUps: { view: true, update: true },
    contactInquiries: { view: true, update: true, archive: false },
    notifications: { view: true, update: true },
    controlRoom: {
      view: false,
      createMembers: false,
      updateMembers: false,
      deactivateMembers: false,
    },
  },

  viewer: {
    dashboard: { view: true },
    leads: {
      view: true,
      update: false,
      assign: false,
      archive: false,
      export: false,
    },
    followUps: { view: true, update: false },
    contactInquiries: { view: true, update: false, archive: false },
    notifications: { view: true, update: false },
    controlRoom: {
      view: false,
      createMembers: false,
      updateMembers: false,
      deactivateMembers: false,
    },
  },
}

const fallbackRoles = [
  {
    value: "superAdmin",
    label: "Super Admin",
    permissions: fallbackPermissionsByRole.superAdmin,
  },
  {
    value: "admin",
    label: "Admin",
    permissions: fallbackPermissionsByRole.admin,
  },
  {
    value: "consultant",
    label: "Consultant",
    permissions: fallbackPermissionsByRole.consultant,
  },
  {
    value: "viewer",
    label: "Viewer",
    permissions: fallbackPermissionsByRole.viewer,
  },
]

const permissionGroups = [
  {
    key: "dashboard",
    label: "Dashboard",
    description: "Access overview and CRM dashboard stats.",
    actions: [{ key: "view", label: "View" }],
  },
  {
    key: "leads",
    label: "Leads",
    description: "Control lead list, details, updates, exports, and archive.",
    actions: [
      { key: "view", label: "View" },
      { key: "update", label: "Update" },
      { key: "assign", label: "Assign" },
      { key: "archive", label: "Archive" },
      { key: "export", label: "Export" },
    ],
  },
  {
    key: "followUps",
    label: "Follow-ups",
    description: "Control follow-up calendar and follow-up updates.",
    actions: [
      { key: "view", label: "View" },
      { key: "update", label: "Update" },
    ],
  },
  {
    key: "contactInquiries",
    label: "Contact Inquiries",
    description: "Control contact messages, status updates, and archive.",
    actions: [
      { key: "view", label: "View" },
      { key: "update", label: "Update" },
      { key: "archive", label: "Archive" },
    ],
  },
  {
    key: "notifications",
    label: "Notifications",
    description: "Control CRM notification viewing and updates.",
    actions: [
      { key: "view", label: "View" },
      { key: "update", label: "Update" },
    ],
  },
  {
    key: "controlRoom",
    label: "Control Room",
    description: "Control team member access and permission management.",
    actions: [
      { key: "view", label: "View" },
      { key: "createMembers", label: "Create Members" },
      { key: "updateMembers", label: "Update Members" },
      { key: "deactivateMembers", label: "Deactivate Members" },
    ],
  },
]

const roleBadgeClass = {
  superAdmin: "bg-orange-50 text-[#FF6B00]",
  admin: "bg-sky-50 text-[#00AEEF]",
  consultant: "bg-emerald-50 text-emerald-700",
  viewer: "bg-slate-100 text-slate-700",
}

const formatDate = (date) => {
  if (!date) return "Never"
  return new Date(date).toLocaleString()
}

const getInitials = (name = "") => {
  return (
    name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "AD"
  )
}

const countPermissions = (permissions = {}) => {
  return Object.values(permissions).reduce((total, modulePermissions) => {
    return (
      total +
      Object.values(modulePermissions || {}).filter((value) => value === true)
        .length
    )
  }, 0)
}

const getRoleLabel = (roles, roleValue) => {
  return roles.find((role) => role.value === roleValue)?.label || roleValue
}

const getRolePermissions = (roles, roleValue) => {
  return (
    roles.find((role) => role.value === roleValue)?.permissions ||
    fallbackPermissionsByRole[roleValue] ||
    fallbackPermissionsByRole.viewer
  )
}

const normalizePermissions = (permissions = {}, role = "viewer", roles = []) => {
  const roleDefaults = getRolePermissions(roles, role)
  const normalized = {}

  permissionGroups.forEach((group) => {
    normalized[group.key] = {}

    group.actions.forEach((action) => {
      const savedValue = permissions?.[group.key]?.[action.key]

      normalized[group.key][action.key] =
        typeof savedValue === "boolean"
          ? savedValue
          : Boolean(roleDefaults?.[group.key]?.[action.key])
    })
  })

  return normalized
}

const AdminControlRoomPage = () => {
  const { admin } = useAdminAuth()

  const [roles, setRoles] = useState(fallbackRoles)
  const [members, setMembers] = useState([])
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 100,
    totalPages: 1,
  })

  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("All")
  const [statusFilter, setStatusFilter] = useState("All")

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "consultant",
  })

  const [resetForm, setResetForm] = useState({
    memberId: "",
    password: "",
  })

  const [permissionDrafts, setPermissionDrafts] = useState({})
  const [expandedPermissions, setExpandedPermissions] = useState({})

  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [resetting, setResetting] = useState(false)
  const [actionLoading, setActionLoading] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")

  const canCreateMembers =
    admin?.role === "superAdmin" ||
    admin?.permissions?.controlRoom?.createMembers !== false

  const canUpdateMembers =
    admin?.role === "superAdmin" ||
    admin?.permissions?.controlRoom?.updateMembers !== false

  const canDeactivateMembers =
    admin?.role === "superAdmin" ||
    admin?.permissions?.controlRoom?.deactivateMembers !== false

  const availableRoles = useMemo(() => {
    if (admin?.role === "superAdmin") return roles

    return roles.filter((role) => role.value !== "superAdmin")
  }, [roles, admin?.role])

  const stats = useMemo(() => {
    return {
      total: pagination.total || members.length,
      active: members.filter((member) => member.isActive).length,
      inactive: members.filter((member) => !member.isActive).length,
      admins: members.filter((member) =>
        ["superAdmin", "admin"].includes(member.role)
      ).length,
    }
  }, [members, pagination.total])

  const getQueryParams = () => {
    const params = {
      page: 1,
      limit: 100,
    }

    if (search.trim()) params.search = search.trim()
    if (roleFilter !== "All") params.role = roleFilter

    if (statusFilter !== "All") {
      params.isActive = statusFilter === "active"
    }

    return params
  }

  const normalizeMemberList = (items = []) => {
    return items.map((member) => ({
      ...member,
      permissions: normalizePermissions(member.permissions, member.role, roles),
      roleLabel: member.roleLabel || getRoleLabel(roles, member.role),
    }))
  }

  const syncPermissionDrafts = (items = []) => {
    const nextDrafts = {}

    items.forEach((member) => {
      nextDrafts[member._id] = normalizePermissions(
        member.permissions,
        member.role,
        roles
      )
    })

    setPermissionDrafts(nextDrafts)
  }

  const loadAccessOptions = async () => {
    try {
      const data = await adminApi.getTeamAccessOptions()
      const nextRoles = data.roles?.length ? data.roles : fallbackRoles

      setRoles(nextRoles)
      return nextRoles
    } catch {
      setRoles(fallbackRoles)
      return fallbackRoles
    }
  }

  const loadMembers = async (activeRoles = roles) => {
    setLoading(true)
    setError("")

    try {
      const data = await adminApi.getTeamMembers(getQueryParams())

      const rawMembers = data.members || data.data?.members || []

      const normalizedMembers = rawMembers.map((member) => ({
        ...member,
        permissions: normalizePermissions(
          member.permissions,
          member.role,
          activeRoles
        ),
        roleLabel: member.roleLabel || getRoleLabel(activeRoles, member.role),
      }))

      setMembers(normalizedMembers)
      syncPermissionDrafts(normalizedMembers)

      setPagination(
        data.pagination ||
          data.data?.pagination || {
            total: data.total || 0,
            page: 1,
            limit: 100,
            totalPages: 1,
          }
      )
    } catch (err) {
      setError(err.message || "Failed to load team members.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const bootControlRoom = async () => {
      const nextRoles = await loadAccessOptions()
      await loadMembers(nextRoles)
    }

    bootControlRoom()

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleSearch = (event) => {
    event.preventDefault()
    loadMembers()
  }

  const handleCreateMember = async (event) => {
    event.preventDefault()

    setCreating(true)
    setError("")
    setSuccess("")

    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        role: form.role,
      }

      await adminApi.createTeamMember(payload)

      setForm({
        name: "",
        email: "",
        password: "",
        role: "consultant",
      })

      setSuccess("Team member created successfully.")
      await loadMembers()
    } catch (err) {
      setError(err.message || "Failed to create team member.")
    } finally {
      setCreating(false)
    }
  }

  const handleRoleChange = async (member, nextRole) => {
    if (!member?._id || member.role === nextRole) return

    setActionLoading(`${member._id}-role`)
    setError("")
    setSuccess("")

    try {
      const data = await adminApi.updateTeamMember(member._id, {
        role: nextRole,
      })

      const updatedMember = {
        ...data.member,
        permissions: normalizePermissions(
          data.member?.permissions,
          data.member?.role,
          roles
        ),
        roleLabel: data.member?.roleLabel || getRoleLabel(roles, nextRole),
      }

      setMembers((prev) =>
        prev.map((item) =>
          item._id === member._id ? { ...item, ...updatedMember } : item
        )
      )

      setPermissionDrafts((prev) => ({
        ...prev,
        [member._id]: normalizePermissions(
          updatedMember.permissions,
          updatedMember.role,
          roles
        ),
      }))

      setSuccess(`${member.name} role updated successfully.`)
    } catch (err) {
      setError(err.message || "Failed to update role.")
    } finally {
      setActionLoading("")
    }
  }

  const handleToggleStatus = async (member) => {
    if (!member?._id) return

    const nextStatus = !member.isActive

    setActionLoading(`${member._id}-status`)
    setError("")
    setSuccess("")

    try {
      const data = await adminApi.updateTeamMemberStatus(
        member._id,
        nextStatus
      )

      const updatedMember = {
        ...data.member,
        permissions: normalizePermissions(
          data.member?.permissions,
          data.member?.role,
          roles
        ),
      }

      setMembers((prev) =>
        prev.map((item) =>
          item._id === member._id ? { ...item, ...updatedMember } : item
        )
      )

      setSuccess(
        nextStatus
          ? `${member.name} activated successfully.`
          : `${member.name} deactivated successfully.`
      )
    } catch (err) {
      setError(err.message || "Failed to update member status.")
    } finally {
      setActionLoading("")
    }
  }

  const handleResetPassword = async (event) => {
    event.preventDefault()

    if (!resetForm.memberId || !resetForm.password) {
      setError("Please select member and enter new password.")
      return
    }

    setResetting(true)
    setError("")
    setSuccess("")

    try {
      await adminApi.resetTeamMemberPassword(
        resetForm.memberId,
        resetForm.password
      )

      setResetForm({
        memberId: "",
        password: "",
      })

      setSuccess("Password reset successfully.")
    } catch (err) {
      setError(err.message || "Failed to reset password.")
    } finally {
      setResetting(false)
    }
  }

  const handleRefresh = async () => {
    const nextRoles = await loadAccessOptions()
    await loadMembers(nextRoles)
  }

  const togglePermissionPanel = (memberId) => {
    setExpandedPermissions((prev) => ({
      ...prev,
      [memberId]: !prev[memberId],
    }))
  }

  const handlePermissionToggle = (member, moduleKey, actionKey) => {
    if (!member?._id) return

    setPermissionDrafts((prev) => {
      const currentDraft =
        prev[member._id] ||
        normalizePermissions(member.permissions, member.role, roles)

      return {
        ...prev,
        [member._id]: {
          ...currentDraft,
          [moduleKey]: {
            ...(currentDraft[moduleKey] || {}),
            [actionKey]: !currentDraft?.[moduleKey]?.[actionKey],
          },
        },
      }
    })
  }

  const handleResetPermissionsToRole = (member) => {
    if (!member?._id) return

    setPermissionDrafts((prev) => ({
      ...prev,
      [member._id]: normalizePermissions(null, member.role, roles),
    }))
  }

  const handleSavePermissions = async (member) => {
    if (!member?._id) return

    setActionLoading(`${member._id}-permissions`)
    setError("")
    setSuccess("")

    try {
      const draftPermissions =
        permissionDrafts[member._id] ||
        normalizePermissions(member.permissions, member.role, roles)

      const data = await adminApi.updateTeamMember(member._id, {
        permissions: draftPermissions,
      })

      const updatedMember = {
        ...data.member,
        permissions: normalizePermissions(
          data.member?.permissions,
          data.member?.role,
          roles
        ),
      }

      setMembers((prev) =>
        prev.map((item) =>
          item._id === member._id ? { ...item, ...updatedMember } : item
        )
      )

      setPermissionDrafts((prev) => ({
        ...prev,
        [member._id]: updatedMember.permissions,
      }))

      setSuccess(`${member.name} permissions updated successfully.`)
    } catch (err) {
      setError(err.message || "Failed to update member permissions.")
    } finally {
      setActionLoading("")
    }
  }

  const isSelfMember = (member) => {
    return String(member?._id || member?.id) === String(admin?.id || admin?._id)
  }

  return (
    <div className="grid gap-5">
      <section className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <p className="font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-[#00AEEF] sm:text-xs">
              Team Access Management
            </p>

            <h1 className="mt-1 font-fredoka text-[32px] font-semibold leading-tight text-slate-950 sm:text-[40px]">
              Control Room
            </h1>

            <p className="mt-1 max-w-3xl font-poppins text-sm font-medium leading-6 text-slate-500">
              Manage TravelEx CRM team members, roles, custom permissions, and
              limited access from one dedicated place.
            </p>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-4 py-2.5 font-poppins text-sm font-semibold text-slate-700 transition hover:border-[#00AEEF] hover:text-[#00AEEF] disabled:opacity-50"
          >
            <FaSyncAlt className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {success && (
        <div className="rounded-[5px] border border-emerald-100 bg-emerald-50 px-5 py-4 font-poppins text-sm font-semibold text-emerald-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-[5px] border border-red-100 bg-red-50 px-5 py-4 font-poppins text-sm font-semibold text-red-600">
          {error}
        </div>
      )}

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-orange-50 text-[#FF6B00]">
            <FaUsers />
          </div>

          <p className="mt-4 font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Total Members
          </p>

          <p className="mt-1 font-fredoka text-[30px] font-semibold text-slate-950">
            {stats.total}
          </p>
        </div>

        <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-emerald-50 text-emerald-700">
            <FaUserCheck />
          </div>

          <p className="mt-4 font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Active Members
          </p>

          <p className="mt-1 font-fredoka text-[30px] font-semibold text-slate-950">
            {stats.active}
          </p>
        </div>

        <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-red-50 text-red-600">
            <FaUserSlash />
          </div>

          <p className="mt-4 font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Inactive Members
          </p>

          <p className="mt-1 font-fredoka text-[30px] font-semibold text-slate-950">
            {stats.inactive}
          </p>
        </div>

        <div className="rounded-[5px] border border-slate-100 bg-white p-4 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-[5px] bg-sky-50 text-[#00AEEF]">
            <FaShieldAlt />
          </div>

          <p className="mt-4 font-poppins text-[10px] font-bold uppercase tracking-[0.1em] text-slate-400">
            Admin Access
          </p>

          <p className="mt-1 font-fredoka text-[30px] font-semibold text-slate-950">
            {stats.admins}
          </p>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="grid gap-5">
          <form
            onSubmit={handleCreateMember}
            className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[5px] bg-[#FF6B00]/10 text-[#FF6B00]">
                <FaPlus />
              </div>

              <div>
                <h2 className="font-fredoka text-[26px] font-semibold text-slate-950">
                  Add Member
                </h2>

                <p className="font-poppins text-sm font-medium text-slate-500">
                  Create limited CRM access for staff.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <input
                value={form.name}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, name: event.target.value }))
                }
                placeholder="Full name"
                required
                disabled={!canCreateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              />

              <input
                value={form.email}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, email: event.target.value }))
                }
                placeholder="Email address"
                type="email"
                required
                disabled={!canCreateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              />

              <input
                value={form.password}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                placeholder="Temporary password"
                type="password"
                required
                minLength={8}
                disabled={!canCreateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              />

              <select
                value={form.role}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, role: event.target.value }))
                }
                disabled={!canCreateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              >
                {availableRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              <div className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-3">
                <p className="font-poppins text-xs font-bold text-slate-700">
                  Default permissions:
                </p>

                <p className="mt-1 font-poppins text-xs font-medium leading-5 text-slate-500">
                  New member will receive the default access for{" "}
                  <span className="font-bold text-[#FF6B00]">
                    {getRoleLabel(availableRoles, form.role)}
                  </span>
                  . You can customize exact permissions after creation.
                </p>
              </div>

              <button
                type="submit"
                disabled={creating || !canCreateMembers}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-4 font-poppins text-sm font-semibold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaPlus />
                {creating ? "Creating..." : "Create Member"}
              </button>
            </div>
          </form>

          <form
            onSubmit={handleResetPassword}
            className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-[5px] bg-slate-100 text-slate-700">
                <FaLock />
              </div>

              <div>
                <h2 className="font-fredoka text-[26px] font-semibold text-slate-950">
                  Reset Password
                </h2>

                <p className="font-poppins text-sm font-medium text-slate-500">
                  Set a new temporary password.
                </p>
              </div>
            </div>

            <div className="mt-5 grid gap-3">
              <select
                value={resetForm.memberId}
                onChange={(event) =>
                  setResetForm((prev) => ({
                    ...prev,
                    memberId: event.target.value,
                  }))
                }
                disabled={!canUpdateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              >
                <option value="">Select member</option>
                {members
                  .filter((member) => !isSelfMember(member))
                  .map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name} - {member.email}
                    </option>
                  ))}
              </select>

              <input
                value={resetForm.password}
                onChange={(event) =>
                  setResetForm((prev) => ({
                    ...prev,
                    password: event.target.value,
                  }))
                }
                placeholder="New temporary password"
                type="password"
                minLength={8}
                disabled={!canUpdateMembers}
                className="h-11 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none transition focus:border-[#00AEEF] disabled:opacity-60"
              />

              <button
                type="submit"
                disabled={resetting || !canUpdateMembers}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[5px] bg-slate-950 px-4 font-poppins text-sm font-semibold text-white transition hover:bg-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaLock />
                {resetting ? "Resetting..." : "Reset Password"}
              </button>
            </div>
          </form>
        </div>

        <div className="rounded-[5px] border border-slate-100 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="font-fredoka text-[28px] font-semibold text-slate-950">
                Team Members
              </h2>

              <p className="font-poppins text-sm font-medium text-slate-500">
                Manage active CRM users, roles, and custom permissions.
              </p>
            </div>

            <form
              onSubmit={handleSearch}
              className="flex flex-col gap-2 sm:flex-row"
            >
              <div className="flex h-10 items-center gap-2 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3">
                <FaSearch className="text-xs text-slate-400" />

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search member..."
                  className="min-w-0 bg-transparent font-poppins text-sm font-semibold text-slate-700 outline-none placeholder:text-slate-400"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(event) => setRoleFilter(event.target.value)}
                className="h-10 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Roles</option>
                {availableRoles.map((role) => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-10 rounded-[5px] border border-slate-200 bg-[#F8FAFC] px-3 font-poppins text-sm font-semibold text-slate-700 outline-none"
              >
                <option value="All">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button
                type="submit"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-[5px] bg-[#00AEEF] px-4 font-poppins text-sm font-semibold text-white transition hover:bg-[#FF6B00]"
              >
                Search
              </button>
            </form>
          </div>

          <div className="mt-5 grid gap-3">
            {loading ? (
              [1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="h-24 animate-pulse rounded-[5px] bg-[#F8FAFC]"
                />
              ))
            ) : members.length === 0 ? (
              <div className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-8 text-center">
                <FaEye className="mx-auto text-2xl text-slate-300" />

                <p className="mt-3 font-poppins text-sm font-semibold text-slate-500">
                  No team members found.
                </p>
              </div>
            ) : (
              members.map((member) => {
                const memberDraft =
                  permissionDrafts[member._id] ||
                  normalizePermissions(member.permissions, member.role, roles)

                const selfMember = isSelfMember(member)
                const permissionLoading =
                  actionLoading === `${member._id}-permissions`

                return (
                  <article
                    key={member._id}
                    className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-4"
                  >
                    <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[5px] bg-slate-950 font-fredoka text-lg font-semibold text-white">
                          {getInitials(member.name)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-poppins text-sm font-bold text-slate-950">
                              {member.name}
                            </h3>

                            <span
                              className={`rounded-[5px] px-2 py-1 font-poppins text-[10px] font-bold uppercase ${
                                roleBadgeClass[member.role] ||
                                "bg-slate-100 text-slate-700"
                              }`}
                            >
                              {member.roleLabel || member.role}
                            </span>

                            <span
                              className={`rounded-[5px] px-2 py-1 font-poppins text-[10px] font-bold uppercase ${
                                member.isActive
                                  ? "bg-emerald-50 text-emerald-700"
                                  : "bg-red-50 text-red-600"
                              }`}
                            >
                              {member.isActive ? "Active" : "Inactive"}
                            </span>

                            {selfMember && (
                              <span className="rounded-[5px] bg-white px-2 py-1 font-poppins text-[10px] font-bold uppercase text-slate-400">
                                You
                              </span>
                            )}
                          </div>

                          <p className="mt-1 break-all font-poppins text-xs font-semibold text-slate-500">
                            {member.email}
                          </p>

                          <p className="mt-1 font-poppins text-[11px] font-medium text-slate-400">
                            Last login: {formatDate(member.lastLogin)}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                        <select
                          value={member.role}
                          onChange={(event) =>
                            handleRoleChange(member, event.target.value)
                          }
                          disabled={
                            !canUpdateMembers ||
                            selfMember ||
                            actionLoading === `${member._id}-role`
                          }
                          className="h-10 rounded-[5px] border border-slate-200 bg-white px-3 font-poppins text-xs font-bold text-slate-700 outline-none disabled:opacity-50"
                        >
                          {availableRoles.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => handleToggleStatus(member)}
                          disabled={
                            !canDeactivateMembers ||
                            actionLoading === `${member._id}-status` ||
                            selfMember
                          }
                          className={`inline-flex h-10 items-center justify-center gap-2 rounded-[5px] px-3 font-poppins text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                            member.isActive
                              ? "bg-red-50 text-red-600 hover:bg-red-600 hover:text-white"
                              : "bg-emerald-50 text-emerald-700 hover:bg-emerald-600 hover:text-white"
                          }`}
                        >
                          {member.isActive ? <FaUserSlash /> : <FaUserCheck />}
                          {actionLoading === `${member._id}-status`
                            ? "Updating..."
                            : member.isActive
                              ? "Deactivate"
                              : "Activate"}
                        </button>
                      </div>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2 border-t border-slate-100 pt-3">
                      <span className="rounded-[5px] bg-white px-2.5 py-1 font-poppins text-[11px] font-bold text-slate-500">
                        {countPermissions(member.permissions)} permissions
                      </span>

                      {member.permissions?.leads?.export && (
                        <span className="rounded-[5px] bg-white px-2.5 py-1 font-poppins text-[11px] font-bold text-[#00AEEF]">
                          Export access
                        </span>
                      )}

                      {member.permissions?.controlRoom?.view && (
                        <span className="rounded-[5px] bg-white px-2.5 py-1 font-poppins text-[11px] font-bold text-[#FF6B00]">
                          Control room access
                        </span>
                      )}

                      {member.permissions?.leads?.update && (
                        <span className="inline-flex items-center gap-1 rounded-[5px] bg-white px-2.5 py-1 font-poppins text-[11px] font-bold text-emerald-700">
                          <FaCheckCircle />
                          Lead update access
                        </span>
                      )}
                    </div>

                    <div className="mt-3 border-t border-slate-100 pt-3">
                      <button
                        type="button"
                        onClick={() => togglePermissionPanel(member._id)}
                        className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-white px-3 py-2 font-poppins text-xs font-bold text-slate-700 transition hover:bg-slate-950 hover:text-white"
                      >
                        <FaUserCog />
                        Customize Permissions
                        {expandedPermissions[member._id] ? (
                          <FaChevronUp />
                        ) : (
                          <FaChevronDown />
                        )}
                      </button>

                      {expandedPermissions[member._id] && (
                        <div className="mt-4 rounded-[5px] border border-slate-100 bg-white p-4">
                          {selfMember && (
                            <div className="mb-4 rounded-[5px] border border-amber-100 bg-amber-50 p-3 font-poppins text-xs font-semibold leading-5 text-amber-700">
                              You cannot edit your own role or permissions here
                              to avoid accidental lockout.
                            </div>
                          )}

                          <div className="grid gap-3">
                            {permissionGroups.map((group) => (
                              <div
                                key={group.key}
                                className="rounded-[5px] border border-slate-100 bg-[#F8FAFC] p-3"
                              >
                                <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                                  <div>
                                    <h4 className="font-poppins text-sm font-bold text-slate-950">
                                      {group.label}
                                    </h4>

                                    <p className="font-poppins text-xs font-medium leading-5 text-slate-500">
                                      {group.description}
                                    </p>
                                  </div>

                                  <span className="w-fit rounded-[5px] bg-white px-2 py-1 font-poppins text-[10px] font-bold uppercase tracking-[0.08em] text-slate-400">
                                    {group.actions.length} controls
                                  </span>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-2">
                                  {group.actions.map((action) => {
                                    const checked = Boolean(
                                      memberDraft?.[group.key]?.[action.key]
                                    )

                                    return (
                                      <label
                                        key={action.key}
                                        className={`flex cursor-pointer items-center gap-2 rounded-[5px] border px-3 py-2 font-poppins text-xs font-bold transition ${
                                          checked
                                            ? "border-[#00AEEF] bg-[#00AEEF]/10 text-[#00AEEF]"
                                            : "border-slate-200 bg-white text-slate-500"
                                        } ${
                                          !canUpdateMembers || selfMember
                                            ? "cursor-not-allowed opacity-60"
                                            : "hover:border-[#FF6B00] hover:text-[#FF6B00]"
                                        }`}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={checked}
                                          disabled={
                                            !canUpdateMembers || selfMember
                                          }
                                          onChange={() =>
                                            handlePermissionToggle(
                                              member,
                                              group.key,
                                              action.key
                                            )
                                          }
                                          className="h-4 w-4 accent-[#FF6B00]"
                                        />

                                        {action.label}
                                      </label>
                                    )
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="font-poppins text-xs font-semibold text-slate-500">
                              Draft permissions selected:{" "}
                              <span className="font-bold text-slate-950">
                                {countPermissions(memberDraft)}
                              </span>
                            </p>

                            <div className="flex flex-col gap-2 sm:flex-row">
                              <button
                                type="button"
                                onClick={() =>
                                  handleResetPermissionsToRole(member)
                                }
                                disabled={!canUpdateMembers || selfMember}
                                className="inline-flex items-center justify-center gap-2 rounded-[5px] border border-slate-200 bg-white px-3 py-2 font-poppins text-xs font-bold text-slate-600 transition hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaUndo />
                                Reset to Role Default
                              </button>

                              <button
                                type="button"
                                onClick={() => handleSavePermissions(member)}
                                disabled={
                                  !canUpdateMembers ||
                                  selfMember ||
                                  permissionLoading
                                }
                                className="inline-flex items-center justify-center gap-2 rounded-[5px] bg-[#FF6B00] px-3 py-2 font-poppins text-xs font-bold text-white transition hover:bg-[#00AEEF] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                <FaSave />
                                {permissionLoading
                                  ? "Saving..."
                                  : "Save Permissions"}
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                )
              })
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

export default AdminControlRoomPage