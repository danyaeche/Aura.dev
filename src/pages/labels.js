import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit2, Trash2 } from "lucide-react";

export default function Labels() {
  const [labels, setLabels] = useState([
    { id: 1, name: 'Character', color: '#FF5733' },
    { id: 2, name: 'Environment', color: '#33FF57' },
    { id: 3, name: 'Prop', color: '#3357FF' },
  ]);
  const [newLabel, setNewLabel] = useState({ name: '', color: '#000000' });
  const [editingLabel, setEditingLabel] = useState(null);

  const addLabel = () => {
    if (newLabel.name) {
      setLabels([...labels, { id: Date.now(), ...newLabel }]);
      setNewLabel({ name: '', color: '#000000' });
    }
  };

  const startEditing = (label) => {
    setEditingLabel({ ...label });
  };

  const saveEdit = () => {
    if (editingLabel) {
      setLabels(labels.map(l => l.id === editingLabel.id ? editingLabel : l));
      setEditingLabel(null);
    }
  };

  const deleteLabel = (id) => {
    setLabels(labels.filter(l => l.id !== id));
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Manage Labels</h1>

      <Card>
        <CardHeader>
          <CardTitle>Add New Label</CardTitle>
        </CardHeader>
        <CardContent className="flex space-x-2">
          <Input
            placeholder="Label name"
            value={newLabel.name}
            onChange={(e) => setNewLabel({ ...newLabel, name: e.target.value })}
          />
          <Input
            type="color"
            value={newLabel.color}
            onChange={(e) => setNewLabel({ ...newLabel, color: e.target.value })}
            className="w-20"
          />
          <Button onClick={addLabel}>
            <Plus className="mr-2 h-4 w-4" /> Add Label
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Labels</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Color</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {labels.map((label) => (
                <TableRow key={label.id}>
                  <TableCell>
                    <div className="w-6 h-6 rounded" style={{ backgroundColor: label.color }}></div>
                  </TableCell>
                  <TableCell>
                    {editingLabel && editingLabel.id === label.id ? (
                      <Input
                        value={editingLabel.name}
                        onChange={(e) => setEditingLabel({ ...editingLabel, name: e.target.value })}
                      />
                    ) : (
                      label.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingLabel && editingLabel.id === label.id ? (
                      <Button onClick={saveEdit} size="sm">Save</Button>
                    ) : (
                      <Button onClick={() => startEditing(label)} size="sm" variant="ghost">
                        <Edit2 className="h-4 w-4" />
                      </Button>
                    )}
                    <Button onClick={() => deleteLabel(label.id)} size="sm" variant="ghost" className="text-red-500">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}