class ApplicationPolicy
  attr_reader :user, :record, :permission, :organization

  def initialize(session, record)
    @record = record
    @user = session.user
    @permission = session.permission
    @organization = session.organization
  end

  def create?
    permission.is_admin?
  end

  def new?
    permission.is_admin?
  end

  def update?
    permission.is_admin?
  end

  def edit?
    update?
  end

  def destroy?
    permission.is_admin?
  end

  def index?
    permission.is_admin?
  end

  private

  def can_read?
    permission.is_admin? || is_owner?
  end

  def can_read_with_org?
    (permission.is_admin? && is_own_org?) || is_owner?
  end

  def is_own_org?
    #TODO need to be override
    false
  end

  def is_owner?
    #TODO need to be override
    false
  end

end
