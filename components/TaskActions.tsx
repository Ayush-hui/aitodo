import DeleteIcon from './icons/DeleteIcon';
import EditIcon from './icons/EditIcon';

type TaskActionsProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export default function TaskActions({ onEdit, onDelete }: TaskActionsProps) {
  return (
    <div className="task-actions">
      <button
        className="btn-icon edit"
        title="Edit"
        data-action="edit"
        type="button"
        onClick={onEdit}
      >
        <EditIcon />
      </button>
      <button
        className="btn-icon delete"
        title="Delete"
        data-action="delete"
        type="button"
        onClick={onDelete}
      >
        <DeleteIcon />
      </button>
    </div>
  );
}
